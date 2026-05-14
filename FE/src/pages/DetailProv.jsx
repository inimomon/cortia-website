import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import axios from "axios";
import Navbar from "../components/ui/Navbar";
import Footer from "../components/ui/Footer";

const BASE_URL = import.meta.env.VITE_BE_LINK;

const statusConfig = {
  KRITIS: {
    bg: "bg-red-50",
    text: "text-red-700",
    border: "border-red-500",
    dot: "bg-red-500",
  },
  ANOMALI: {
    bg: "bg-yellow-50",
    text: "text-yellow-700",
    border: "border-yellow-500",
    dot: "bg-yellow-500",
  },
  STABIL: {
    bg: "bg-green-50",
    text: "text-green-700",
    border: "border-green-500",
    dot: "bg-green-500",
  },
};

const translateCategory = (category) => {
  const value = String(category || "").toLowerCase();

  if (value === "goods") return "Barang";
  if (value === "services") return "Jasa";
  if (value === "works") return "Pekerjaan/Konstruksi";

  return category || "Tanpa Kategori";
};

const categoryColor = (percentage) => {
  const value = Number(percentage || 0);

  if (value >= 50) {
    return {
      bar: "bg-red-500",
      text: "text-red-600",
      bg: "bg-red-50",
    };
  }

  if (value >= 25) {
    return {
      bar: "bg-yellow-500",
      text: "text-yellow-600",
      bg: "bg-yellow-50",
    };
  }

  return {
    bar: "bg-green-500",
    text: "text-green-600",
    bg: "bg-green-50",
  };
};

const slugToProvinceName = (slug) => {
  if (!slug) return "";

  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const skorColor = (score) => {
  const value = Number(score || 0);

  if (value >= 15) return "text-red-600";
  if (value >= 7) return "text-yellow-500";
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
          `${BASE_URL}/prediction/summary`,
        );
        const riskMapResponse = await axios.get(`${BASE_URL}/riskMap`);

        let projectData = [];

        try {
          const projectResponse = await axios.get(
            `${BASE_URL}/transaction/projects/${encodeURIComponent(provinceName)}`,
          );

          projectData = projectResponse.data?.data || [];
        } catch (projectErr) {
          console.warn("PROJECT DATA ERROR:", projectErr);
          projectData = [];
        }

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
        setProjects(projectData.slice(0, 5));
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
          <div className="bg-white rounded-2xl border border-red-200 p-8 text-center shadow-sm">
            <p className="text-red-600 font-semibold mb-4">
              {error || "Data provinsi tidak ditemukan."}
            </p>

            <button
              onClick={() => navigate("/explore")}
              className="px-5 py-2.5 rounded-lg bg-[#0B1C30] text-white text-sm"
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
    <div className="pt-20 min-h-screen bg-gradient-to-b from-white to-slate-100 font-sans">
      <Navbar variant="internal" />

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-10">
        <button
          onClick={() => navigate("/explore")}
          className="inline-flex items-center gap-2 px-5 py-2.5 mb-3 rounded-xl bg-[#0B1C30] text-white text-sm font-semibold hover:bg-[#132B46] active:scale-[0.98] transition-all duration-200 shadow-sm"
        >
          <span><ArrowLeft /></span>
          Kembali
        </button>

        <section className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
            <div>
              <p className="text-[11px] font-bold tracking-[0.25em] text-slate-400 uppercase mb-2">
                Detail Provinsi
              </p>

              <h1 className="text-3xl md:text-5xl font-bold text-[#0B1C30] font-serif">
                {detail.daerah}
              </h1>
            </div>

            <span
              className={`w-fit inline-flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-full ${cfg.bg} ${cfg.text}`}
            >
              <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
              {detail.status}
            </span>
          </div>

          <div className={`border-t-2 ${cfg.border} mb-8`} />

          <div className="grid md:grid-cols-3 gap-5 mb-8">
            <StatCard
              label="Total Anggaran"
              value={detail.totalAnggaranFormatted}
            />
            <StatCard
              label="Total Proyek"
              value={Number(
                detail.totalProyek || detail.totalData || 0,
              ).toLocaleString("id-ID")}
            />
            <StatCard
              label="Skor Risiko"
              value={Number(detail.skorRisiko || 0).toFixed(2)}
              valueClass={skorColor(detail.skorRisiko)}
            />
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <section className="bg-white border border-slate-200 rounded-2xl p-5">
              <h2 className="font-bold text-[#0B1C30] mb-5">
                Alokasi per Kategori
              </h2>

              <div className="space-y-4">
                {detail.categoryBreakdown?.length > 0 ? (
                  detail.categoryBreakdown.map((item) => {
                    const color = categoryColor(item.percentage);

                    return (
                      <div
                        key={item.name}
                        className={`${color.bg} rounded-xl p-3`}
                      >
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span className="font-medium text-slate-700">
                            {translateCategory(item.name)}
                          </span>

                          <span className={`font-bold ${color.text}`}>
                            {item.percentage}%
                          </span>
                        </div>

                        <div className="h-2 bg-white rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${color.bar}`}
                            style={{ width: `${item.percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-sm text-slate-400">Belum ada kategori.</p>
                )}
              </div>
            </section>

            <section className="bg-white border border-slate-200 rounded-2xl p-5">
              <h2 className="font-bold text-[#0B1C30] mb-5">Sebaran Risiko</h2>

              <InfoRow label="Kritis" value={detail.danger} type="danger" />
              <InfoRow label="Anomali" value={detail.warning} type="warning" />
              <InfoRow label="Stabil" value={detail.safe} type="safe" />
              <InfoRow label="Total Data" value={detail.totalData} />
            </section>
          </div>

          <section className="mt-8 border border-slate-200 bg-white rounded-2xl overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 px-5 md:px-7 py-5 border-b border-slate-200">
              <div>
                <p className="text-[11px] font-bold tracking-[0.25em] text-slate-400 uppercase mb-1">
                  Project List
                </p>

                <h2 className="text-xl md:text-2xl font-bold text-[#0B1C30]">
                  Daftar Proyek Infrastruktur
                </h2>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-7 py-4 text-[11px] font-bold tracking-widest text-slate-500 uppercase">
                      Nama Proyek
                    </th>
                    <th className="px-7 py-4 text-[11px] font-bold tracking-widest text-slate-500 uppercase">
                      Kategori
                    </th>
                    <th className="px-7 py-4 text-[11px] font-bold tracking-widest text-slate-500 uppercase">
                      Alokasi
                    </th>
                    <th className="px-7 py-4 text-[11px] font-bold tracking-widest text-slate-500 uppercase">
                      Status
                    </th>
                    <th className="px-7 py-4 text-[11px] font-bold tracking-widest text-slate-500 uppercase">
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
                        statusConfig[status] || statusConfig.STABIL;

                      return (
                        <tr
                          key={project.id}
                          className="border-b border-slate-100 hover:bg-slate-50 transition"
                        >
                          <td className="px-7 py-5 font-semibold text-[#0B1C30] min-w-[300px]">
                            {project.tender_title || "-"}
                          </td>

                          <td className="px-7 py-5 text-slate-600">
                            {translateCategory(
                              project.mainprocurementcategory ||
                                project.category,
                            )}
                          </td>

                          <td className="px-7 py-5 font-bold text-[#0B1C30]">
                            {formatShortCurrency(
                              project.award_value ||
                                project.harga_final ||
                                project.tender_minvalue,
                            )}
                          </td>

                          <td className="px-7 py-5">
                            <span
                              className={`inline-flex items-center gap-2 px-3 py-1 text-[10px] font-bold uppercase rounded-full ${statusStyle.bg} ${statusStyle.text}`}
                            >
                              <span
                                className={`w-2 h-2 rounded-full ${statusStyle.dot}`}
                              />
                              {status}
                            </span>
                          </td>

                          <td className="px-7 py-5">
                            <button
                              className="text-xs font-bold text-[#0B1C30] uppercase hover:underline"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/analisa/${project.id}`);
                              }}
                            >
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
                        className="px-7 py-10 text-center text-slate-500"
                      >
                        Belum ada proyek untuk daerah ini.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </section>
      </main>

      <Footer />
    </div>
  );
}

const StatCard = ({ label, value, valueClass = "text-[#0B1C30]" }) => (
  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
    <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-2">
      {label}
    </p>

    <p className={`text-3xl font-bold ${valueClass}`}>{value}</p>
  </div>
);

const InfoRow = ({ label, value, type }) => {
  const typeStyle = {
    danger: "text-red-600 bg-red-50",
    warning: "text-yellow-600 bg-yellow-50",
    safe: "text-green-600 bg-green-50",
  };

  return (
    <div className="flex items-center justify-between py-3 border-b border-slate-100 last:border-b-0">
      <span className="text-sm text-slate-500">{label}</span>

      <span
        className={`text-sm font-bold px-2.5 py-1 rounded-full ${
          typeStyle[type] || "text-[#0B1C30] bg-slate-50"
        }`}
      >
        {Number(value || 0).toLocaleString("id-ID")}
      </span>
    </div>
  );
};
