import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/ui/Navbar";

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

const skorColor = (score) => {
  if (score >= 15) return "text-red-600";
  if (score >= 7) return "text-yellow-500";
  return "text-green-600";
};

export default function ExplorePage() {
  const [search, setSearch] = useState("");
  const [risiko, setRisiko] = useState("Semua Tingkat");

  const [data, setData] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // PAGINATION
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        // FETCH SUMMARY
        const summaryResponse = await axios.get(
          `${import.meta.env.VITE_BE_LINK}/prediction/summary`,
        );

        // FETCH RISK MAP
        const riskMapResponse = await axios.get(
          `${import.meta.env.VITE_BE_LINK}/riskMap`,
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

        // MERGE DATA
        const merged = summaryData.map((item) => {
          const risk = riskMapData.find(
            (r) =>
              r.daerah?.toLowerCase().trim() ===
              item.daerah?.toLowerCase().trim(),
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

        // SORT HIGHEST SCORE
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

  // FILTER
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

  // RESET PAGE
  useEffect(() => {
    setCurrentPage(1);
  }, [search, risiko]);

  // PAGINATION
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;

    return filtered.slice(start, end);
  }, [filtered, currentPage]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Navbar variant="internal" />

      <div className="max-w-7xl mx-auto px-6 pt-24 pb-20">
        {/* HEADER */}
        <h1 className="text-4xl font-bold text-gray-900 mb-2 font-serif">
          Eksplorasi Anggaran Infrastruktur
        </h1>

        <p className="text-gray-500 text-sm mb-8">
          Jelajahi total anggaran, category proyek, dan skor risiko per daerah.
        </p>

        {/* FILTER */}
        <div className="flex flex-wrap gap-3 mb-8">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari daerah..."
            className="flex-1 min-w-64 border border-gray-200 rounded-lg px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gray-300"
          />

          <select
            value={risiko}
            onChange={(e) => setRisiko(e.target.value)}
            className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm bg-white focus:outline-none"
          >
            {["Semua Tingkat", "Kritis", "Anomali", "Stabil"].map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="bg-white border border-gray-200 rounded-xl p-10 text-center text-gray-500">
            Memuat data...
          </div>
        )}

        {/* ERROR */}
        {!loading && error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-red-700">
            {error}
          </div>
        )}

        {/* CONTENT */}
        {!loading && !error && (
          <>
            {/* GRID */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {paginatedData.map((province) => {
                const cfg =
                  statusConfig[province.status] || statusConfig.STABIL;

                return (
                  <div
                    key={province.key}
                    onClick={() => navigate(`/detail-prov/${province.key}`)}
                    className="bg-white border border-gray-200 rounded-md p-4 shadow-sm hover:shadow-md transition"
                  >
                    {/* TOP */}
                    <div className="flex items-start justify-between mb-1 gap-3">
                      <div>
                        <h3 className="text-xl font-bold text-slate-900 leading-tight">
                          {province.daerah}
                        </h3>
                      </div>

                      <span
                        className={`text-[10px] font-bold px-2 py-1 rounded-sm ${cfg.bg} ${cfg.text} flex items-center gap-1`}
                      >
                        △ {province.status}
                      </span>
                    </div>

                    {/* BORDER */}
                    <div className={`border-t-2 ${cfg.border} my-3`} />

                    {/* BUDGET */}
                    <p className="text-[10px] font-bold tracking-widest text-gray-500 uppercase mb-1">
                      Total Anggaran
                    </p>

                    <p className="text-3xl font-bold text-slate-900 mb-4">
                      {province.totalAnggaranFormatted}
                    </p>

                    {/* CATEGORY */}
                    <div className="space-y-2 mb-4">
                      {province.categoryBreakdown?.length > 0 ? (
                        province.categoryBreakdown.map((item) => (
                          <div
                            key={item.name}
                            className="flex items-center justify-between text-sm"
                          >
                            <span className="text-gray-600 truncate pr-3">
                              {item.name}
                            </span>

                            <span className="font-semibold text-slate-900">
                              {item.percentage}%
                            </span>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-gray-400">
                          Belum ada category
                        </p>
                      )}
                    </div>

                    {/* FOOTER */}
                    <div className="border-t border-gray-200 pt-3 flex items-center justify-between">
                      <div>
                        <p className="text-[10px] font-bold tracking-widest text-gray-500 uppercase">
                          Skor Risiko
                        </p>

                        <p
                          className={`text-xs font-bold ${skorColor(
                            province.skorAnomali,
                          )}`}
                        >
                          {province.skorAnomali.toFixed(2)}
                        </p>
                      </div>

                      <button
                        onClick={() => navigate(`/detail-prov/${province.key}`)}
                        className="text-sm text-black font-medium hover:underline"
                      >
                        Detail →
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* PAGINATION */}
            {filtered.length > 0 && (
              <div className="flex items-center justify-between mt-8">
                <p className="text-sm text-gray-500">
                  Menampilkan {(currentPage - 1) * itemsPerPage + 1} -{" "}
                  {Math.min(currentPage * itemsPerPage, filtered.length)} dari{" "}
                  {filtered.length} data
                </p>

                <div className="flex items-center gap-2">
                  <button
                    disabled={currentPage === 1}
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white disabled:opacity-40"
                  >
                    Prev
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`w-9 h-9 rounded-lg text-sm border ${
                        currentPage === i + 1
                          ? "bg-slate-900 text-white border-slate-900"
                          : "bg-white border-gray-200 text-gray-700"
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
                    className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

            {/* EMPTY */}
            {filtered.length === 0 && (
              <div className="bg-white border border-gray-200 rounded-xl p-10 text-center text-gray-500 mt-5">
                Tidak ada data ditemukan.
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
