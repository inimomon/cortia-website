import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/ui/Navbar";
import Footer from "../components/ui/Footer";

const statusConfig = {
  KRITIS: {
    bg: "bg-red-50",
    text: "text-red-700",
    border: "border-red-500",
  },
  ANOMALI: {
    bg: "bg-yellow-50",
    text: "text-yellow-700",
    border: "border-yellow-500",
  },
  STABIL: {
    bg: "bg-green-50",
    text: "text-green-700",
    border: "border-green-500",
  },
};

const skorColor = (score) => {
  const value = Number(score || 0);

  if (value >= 15) return "text-red-600";
  if (value >= 7) return "text-yellow-500";
  return "text-green-600";
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
    };
  }

  if (value >= 25) {
    return {
      bar: "bg-yellow-500",
      text: "text-yellow-600",
    };
  }

  return {
    bar: "bg-green-500",
    text: "text-green-600",
  };
};

export default function ExplorePage() {
  const [search, setSearch] = useState("");
  const [risiko, setRisiko] = useState("Semua Tingkat");
  const [data, setData] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        const summaryResponse = await axios.get(
          `${import.meta.env.VITE_BE_LINK}/prediction/summary`
        );

        const riskMapResponse = await axios.get(
          `${import.meta.env.VITE_BE_LINK}/riskMap`
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

        const merged = summaryData.map((item) => {
          const risk = riskMapData.find(
            (r) =>
              r.daerah?.toLowerCase().trim() ===
              item.daerah?.toLowerCase().trim()
          );

          const heatStatus = risk?.heatmap_status || "SAFE";

          return {
            ...item,
            skorAnomali: Number(risk?.index_resiko || 0),
            status:
              heatStatus === "DANGER"
                ? "KRITIS"
                : heatStatus === "WARNING"
                ? "ANOMALI"
                : "STABIL",
            riskLevel: heatStatus,
          };
        });

        merged.sort((a, b) => b.skorAnomali - a.skorAnomali);

        setData(merged);
      } catch (err) {
        console.error("FETCH ERROR:", err);
        setError("Backend tidak dapat diakses.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filtered = useMemo(() => {
    return data.filter((province) => {
      const query = search.trim().toLowerCase();

      const matchSearch =
        !query ||
        province.daerah?.toLowerCase().includes(query) ||
        province.key?.toLowerCase().includes(query);

      const matchRisiko =
        risiko === "Semua Tingkat" ||
        (risiko === "Kritis" && province.status === "KRITIS") ||
        (risiko === "Anomali" && province.status === "ANOMALI") ||
        (risiko === "Stabil" && province.status === "STABIL");

      return matchSearch && matchRisiko;
    });
  }, [data, search, risiko]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, risiko]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filtered.slice(start, start + itemsPerPage);
  }, [filtered, currentPage]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-100 font-sans">
      <Navbar variant="internal" />

      <main className="max-w-7xl mx-auto px-4 md:px-6 pt-28 pb-20">
        <div className="mb-10">
          <p className="text-[11px] font-bold tracking-[0.25em] uppercase text-[#0B1C30]/50 mb-3">
            Explore Data
          </p>

          <h1 className="text-3xl md:text-5xl font-bold text-[#0B1C30] font-serif leading-tight">
            Eksplorasi Anggaran Infrastruktur
          </h1>

          <p className="text-[#0B1C30]/60 text-sm md:text-base mt-3 max-w-2xl">
            Jelajahi total anggaran, kategori proyek, dan skor risiko per daerah
            secara lebih terbuka dan terstruktur.
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 md:p-5 shadow-sm mb-8">
          <div className="flex flex-col md:flex-row gap-3">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari daerah..."
              className="flex-1 border border-slate-200 rounded-xl px-4 py-3 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#0B1C30]/20"
            />

            <select
              value={risiko}
              onChange={(e) => setRisiko(e.target.value)}
              className="border border-slate-200 rounded-xl px-4 py-3 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#0B1C30]/20"
            >
              {["Semua Tingkat", "Kritis", "Anomali", "Stabil"].map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </div>
        </div>

        {loading && (
          <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center text-slate-500 shadow-sm">
            Memuat data...
          </div>
        )}

        {!loading && error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-red-700">
            {error}
          </div>
        )}

        {!loading && !error && (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {paginatedData.map((province) => {
                const cfg =
                  statusConfig[province.status] || statusConfig.STABIL;

                return (
                  <div
                    key={province.key}
                    onClick={() => navigate(`/detail-prov/${province.key}`)}
                    className="group bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-3 gap-3">
                      <h3 className="text-xl font-bold text-[#0B1C30] leading-tight">
                        {province.daerah}
                      </h3>

                      <span
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${cfg.bg} ${cfg.text}`}
                      >
                        △ {province.status}
                      </span>
                    </div>

                    <div className={`border-t-2 ${cfg.border} mb-5`} />

                    <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-1">
                      Total Anggaran
                    </p>

                    <p className="text-3xl font-bold text-[#0B1C30] mb-5">
                      {province.totalAnggaranFormatted}
                    </p>

                    <div className="space-y-3 mb-5">
                      {province.categoryBreakdown?.length > 0 ? (
                        province.categoryBreakdown.slice(0, 3).map((item) => {
                          const color = categoryColor(item.percentage);

                          return (
                            <div key={item.name}>
                              <div className="flex items-center justify-between text-sm mb-1">
                                <span className="text-slate-600 truncate pr-3">
                                  {translateCategory(item.name)}
                                </span>

                                <span className={`font-semibold ${color.text}`}>
                                  {item.percentage}%
                                </span>
                              </div>

                              <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full ${color.bar}`}
                                  style={{ width: `${item.percentage}%` }}
                                />
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <p className="text-sm text-slate-400">
                          Belum ada kategori
                        </p>
                      )}
                    </div>

                    <div className="border-t border-slate-100 pt-4 flex items-center justify-between">
                      <div>
                        <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                          Skor Risiko
                        </p>

                        <p
                          className={`text-sm font-bold ${skorColor(
                            province.skorAnomali
                          )}`}
                        >
                          {Number(province.skorAnomali || 0).toFixed(2)}
                        </p>
                      </div>

                      <span className="text-sm text-[#0B1C30] font-semibold group-hover:underline">
                        Detail
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {filtered.length > 0 && (
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-10">
                <p className="text-sm text-slate-500">
                  Menampilkan {(currentPage - 1) * itemsPerPage + 1} -{" "}
                  {Math.min(currentPage * itemsPerPage, filtered.length)} dari{" "}
                  {filtered.length} data
                </p>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    disabled={currentPage === 1}
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    className="px-4 py-2 text-sm border border-slate-200 rounded-lg bg-white disabled:opacity-40"
                  >
                    Prev
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`w-9 h-9 rounded-lg text-sm border ${
                        currentPage === i + 1
                          ? "bg-[#0B1C30] text-white border-[#0B1C30]"
                          : "bg-white border-slate-200 text-slate-700"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}

                  <button
                    disabled={currentPage === totalPages}
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    className="px-4 py-2 text-sm border border-slate-200 rounded-lg bg-white disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

            {filtered.length === 0 && (
              <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center text-slate-500 mt-5">
                Tidak ada data ditemukan.
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}