import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/ui/Navbar";
import Footer from "../components/ui/Footer";

const statusConfig = {
  KRITIS: {
    bg: "bg-red-100",
    text: "text-red-700",
    border: "border-red-500",
  },
  ANOMALI: {
    bg: "bg-yellow-100",
    text: "text-yellow-700",
    border: "border-yellow-500",
  },
  STABIL: {
    bg: "bg-green-100",
    text: "text-green-700",
    border: "border-green-500",
  },
};

const slugToProvinceName = (slug) => {
  if (!slug) return "";

  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const skorColor = (score) => {
  if (score >= 15) return "text-red-600";
  if (score >= 7) return "text-yellow-500";
  return "text-green-600";
};

const normalizeText = (value) => {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ");
};

const formatShortCurrency = (value) => {
  const num = Number(value || 0);

  if (num >= 1_000_000_000_000) {
    return `Rp ${(num / 1_000_000_000_000).toFixed(1)}T`;
  }

  if (num >= 1_000_000_000) {
    return `Rp ${(num / 1_000_000_000).toFixed(0)}M`;
  }

  if (num >= 1_000_000) {
    return `Rp ${(num / 1_000_000).toFixed(0)}Jt`;
  }

  return `Rp ${num.toLocaleString("id-ID")}`;
};

export default function DetailProv() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [detail, setDetail] = useState(null);
  const [projects, setProjects] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const provinceName = useMemo(() => slugToProvinceName(id), [id]);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        setError("");

        const summaryResponse = await axios.get(
          `${import.meta.env.VITE_BE_LINK}/prediction/summary`,
        );

        const riskMapResponse = await axios.get(
          `${import.meta.env.VITE_BE_LINK}/riskMap`,
        );

        const projectResponse = await axios.get(
          `${import.meta.env.VITE_BE_LINK}/prediction`,
        );

        if (!summaryResponse.data.success) {
          setError("Data summary gagal dimuat.");
          return;
        }

        if (!riskMapResponse.data.success) {
          setError("Data risk map gagal dimuat.");
          return;
        }

        const summaryData = summaryResponse.data.data || [];
        const riskMapData = riskMapResponse.data.data || [];
        const projectData = projectResponse.data || [];

        const summary = summaryData.find(
          (item) =>
            normalizeText(item.key) === normalizeText(id) ||
            normalizeText(item.daerah) === normalizeText(provinceName),
        );

        if (!summary) {
          setError("Data provinsi tidak ditemukan.");
          setDetail(null);
          return;
        }

        const risk = riskMapData.find(
          (item) =>
            normalizeText(item.daerah) === normalizeText(summary.daerah) ||
            normalizeText(item.daerah) === normalizeText(provinceName),
        );

        const filteredProjects = projectData
          .filter(
            (item) =>
              normalizeText(item.daerah) === normalizeText(summary.daerah) ||
              normalizeText(item.daerah) === normalizeText(provinceName),
          )
          .slice(0, 5);

        const heatStatus = risk?.heatmap_status || "SAFE";

        const merged = {
          ...summary,
          skorRisiko: Number(risk?.index_resiko || 0),
          totalData: Number(risk?.total_data || summary.totalProyek || 0),
          danger: Number(risk?.count_danger || 0),
          warning: Number(risk?.count_warning || 0),
          safe: Number(risk?.count_safe || 0),
          totalAlokasi: Number(
            risk?.total_alokasi || summary.totalAnggaran || 0,
          ),
          totalAlokasiFinal: Number(risk?.total_alokasi_final || 0),
          status:
            heatStatus === "DANGER"
              ? "KRITIS"
              : heatStatus === "WARNING"
                ? "ANOMALI"
                : "STABIL",
          heatStatus,
        };

        setDetail(merged);
        setProjects(filteredProjects);
      } catch (err) {
        console.error("DETAIL PROVINCE ERROR:", err);
        setError("Detail provinsi belum bisa diakses dari backend.");
        setDetail(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchDetail();
  }, [id, provinceName]);

  if (loading) {
    return (
      <div className="pt-20 min-h-screen bg-slate-50">
        <Navbar variant="internal" />
        <div className="max-w-7xl mx-auto px-6 py-20 text-center text-slate-500">
          Memuat detail provinsi...
        </div>
      </div>
    );
  }

  if (error || !detail) {
    return (
      <div className="pt-20 min-h-screen bg-slate-50">
        <Navbar variant="internal" />

        <div className="max-w-5xl mx-auto px-6 py-20">
          <div className="bg-white rounded-xl border border-red-200 p-8 text-center">
            <p className="text-red-600 font-semibold mb-4">
              {error || "Data provinsi tidak ditemukan."}
            </p>

            <button
              onClick={() => navigate("/explore")}
              className="px-4 py-2 rounded-lg bg-slate-900 text-white text-sm"
            >
              Kembali ke Explore
            </button>
          </div>
        </div>
      </div>
    );
  }

  const cfg = statusConfig[detail.status] || statusConfig.STABIL;

  return (
    <div className="pt-20 min-h-screen bg-slate-50 font-sans">
      <Navbar variant="internal" />

      <main className="max-w-7xl mx-auto px-6 py-10">
        <button
          onClick={() => navigate("/explore")}
          className="text-sm text-slate-500 hover:text-slate-900 mb-6"
        >
          ← Kembali ke Explore
        </button>

        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4 mb-2">
            <div>
              <p className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-2">
                Detail Provinsi
              </p>

              <h1 className="text-4xl font-bold text-slate-900">
                {detail.daerah}
              </h1>
            </div>

            <span
              className={`text-xs font-bold px-3 py-1 rounded-sm ${cfg.bg} ${cfg.text}`}
            >
              △ {detail.status}
            </span>
          </div>

          <div className={`border-t-2 ${cfg.border} my-5`} />

          <div className="grid md:grid-cols-3 gap-5 mb-8">
            <div>
              <p className="text-[10px] font-bold tracking-widest text-gray-500 uppercase mb-1">
                Total Anggaran
              </p>

              <p className="text-3xl font-bold text-slate-900">
                {detail.totalAnggaranFormatted}
              </p>
            </div>

            <div>
              <p className="text-[10px] font-bold tracking-widest text-gray-500 uppercase mb-1">
                Total Proyek
              </p>

              <p className="text-3xl font-bold text-slate-900">
                {Number(
                  detail.totalProyek || detail.totalData || 0,
                ).toLocaleString("id-ID")}
              </p>
            </div>

            <div>
              <p className="text-[10px] font-bold tracking-widest text-gray-500 uppercase mb-1">
                Skor Risiko
              </p>

              <p
                className={`text-3xl font-bold ${skorColor(detail.skorRisiko)}`}
              >
                {detail.skorRisiko.toFixed(2)}
              </p>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <section className="border border-gray-200 rounded-xl p-5">
              <h2 className="font-bold text-slate-900 mb-4">
                Alokasi per Category
              </h2>

              <div className="space-y-3">
                {detail.categoryBreakdown?.length > 0 ? (
                  detail.categoryBreakdown.map((item) => (
                    <div key={item.name}>
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-gray-600">{item.name}</span>
                        <span className="font-bold text-slate-900">
                          {item.percentage}%
                        </span>
                      </div>

                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-slate-900 rounded-full"
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-400">Belum ada category.</p>
                )}
              </div>
            </section>

            <section className="border border-gray-200 rounded-xl p-5">
              <h2 className="font-bold text-slate-900 mb-4">Sebaran Risiko</h2>

              <InfoRow label="Danger" value={detail.danger} danger />
              <InfoRow label="Warning" value={detail.warning} warning />
              <InfoRow label="Safe" value={detail.safe} />
              <InfoRow label="Total Data" value={detail.totalData} />
            </section>
          </div>

          <section className="mt-8 border border-gray-300 bg-white">
            <div className="flex items-center justify-between px-7 py-5 border-b border-gray-300">
              <h2 className="text-2xl font-bold text-black">
                Daftar Proyek Infrastruktur
              </h2>

              <div className="flex items-center gap-5 text-slate-700">
                <button className="text-lg">≡</button>
                <button className="text-lg">⇩</button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100 border-b border-gray-300">
                    <th className="px-7 py-4 text-[11px] font-bold tracking-widest text-slate-600 uppercase">
                      Nama Proyek
                    </th>
                    <th className="px-7 py-4 text-[11px] font-bold tracking-widest text-slate-600 uppercase">
                      Kategori
                    </th>
                    <th className="px-7 py-4 text-[11px] font-bold tracking-widest text-slate-600 uppercase">
                      Alokasi
                    </th>
                    <th className="px-7 py-4 text-[11px] font-bold tracking-widest text-slate-600 uppercase">
                      Status
                    </th>
                    <th className="px-7 py-4 text-[11px] font-bold tracking-widest text-slate-600 uppercase">
                      Detail
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {projects.length > 0 ? (
                    projects.map((project) => {
                      const risk = String(
                        project.risk_level || "low",
                      ).toLowerCase();

                      const status =
                        risk === "high"
                          ? "KRITIS"
                          : risk === "medium"
                            ? "ANOMALI"
                            : "STABIL";

                      const statusStyle =
                        status === "KRITIS"
                          ? "bg-red-500 text-white"
                          : status === "ANOMALI"
                            ? "bg-orange-400 text-white"
                            : "bg-emerald-500 text-white";

                      return (
                        <tr
                          key={project.id}
                          className="border-b border-gray-300 hover:bg-slate-50"
                        >
                          <td className="px-7 py-5 font-bold text-black">
                            {project.tender_title || "-"}
                          </td>

                          <td className="px-7 py-5 text-slate-600">
                            {project.category || "Tanpa Kategori"}
                          </td>

                          <td className="px-7 py-5 font-bold text-slate-900">
                            {formatShortCurrency(
                              project.harga_final || project.harga_awal,
                            )}
                          </td>

                          <td className="px-7 py-5">
                            <span
                              className={`px-3 py-1 text-[10px] font-bold uppercase ${statusStyle}`}
                            >
                              {status}
                            </span>
                          </td>

                          <td className="px-7 py-5">
                            <button className="text-xs font-bold text-black uppercase hover:underline">
                              Lihat Detail
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td
                        colSpan="5"
                        className="px-7 py-8 text-center text-slate-500"
                      >
                        Belum ada proyek untuk daerah ini.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}

const InfoRow = ({ label, value, danger, warning }) => (
  <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
    <span className="text-sm text-slate-500">{label}</span>

    <span
      className={`text-sm font-bold ${
        danger ? "text-red-600" : warning ? "text-yellow-500" : "text-slate-900"
      }`}
    >
      {Number(value || 0).toLocaleString("id-ID")}
    </span>
  </div>
);
