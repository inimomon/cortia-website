import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/ui/Navbar";
import Footer from "../components/ui/Footer";

const BASE_URL = import.meta.env.VITE_BE_LINK;
const API = `${BASE_URL}/audit`;

const formatNumber = (value) => {
  const number = Number(value);
  if (!Number.isFinite(number)) return "-";
  return number.toLocaleString("id-ID");
};

const formatScore = (value) => {
  const number = Number(value);
  if (!Number.isFinite(number)) return "-";
  return number.toFixed(4);
};

const formatRiskLabel = (level) => {
  const normalized = String(level || "").toLowerCase();

  if (normalized === "high") return "Tinggi";
  if (normalized === "medium") return "Sedang";
  if (normalized === "low") return "Rendah";

  return "Tidak Diketahui";
};

const riskBadge = (level) => {
  const normalized = String(level || "").toLowerCase();

  const map = {
    high: "bg-red-100 text-red-700 border border-red-200",
    medium: "bg-orange-100 text-orange-700 border border-orange-200",
    low: "bg-emerald-100 text-emerald-700 border border-emerald-200",
  };

  return map[normalized] || "bg-gray-100 text-gray-600 border border-gray-200";
};

function TxModal({ tx, onClose }) {
  if (!tx) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-5 gap-4">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">
              Detail Riwayat Proyek
            </p>

            <h2 className="text-lg font-bold text-gray-900">
              {tx.tender_title || "Proyek Tanpa Judul"}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 text-xl font-light"
          >
            ×
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
          {[
            ["Nama Daerah", tx.nama_daerah],
            ["Tanggal Penetapan", tx.award_date],
            ["Nilai Minimum Tender", `Rp ${formatNumber(tx.tender_minvalue)}`],
            ["Nilai Kontrak", `Rp ${formatNumber(tx.award_value)}`],
            ["Vendor Pemenang", tx.award_supplier],
            [
              "Durasi Tender",
              tx.days_to_award ? `${tx.days_to_award} Hari` : "-",
            ],
            ["Kategori Pengadaan", tx.mainprocurementcategory],
            ["Judul Kontrak", tx.award_title],
          ].map(([label, value]) => (
            <div key={label}>
              <p className="text-xs text-gray-400 mb-0.5">{label}</p>

              <p className="text-sm text-gray-800 font-medium break-words">
                {value || "-"}
              </p>
            </div>
          ))}
        </div>

        <div className="bg-gray-50 rounded-xl p-4 mb-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                Skor Risiko AI
              </p>

              <p className="text-3xl font-bold text-gray-900">
                {formatScore(tx.score)}
              </p>
            </div>

            <span
              className={`text-xs font-semibold px-3 py-1 rounded-full ${riskBadge(
                tx.risk_level,
              )}`}
            >
              Risiko {formatRiskLabel(tx.risk_level)}
            </span>
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
            Penjelasan AI
          </p>

          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans">
              {tx.explanation || "Tidak ada penjelasan dari AI."}
            </pre>
          </div>
        </div>

        <div className="mt-5 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-700 transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AuditDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [audit, setAudit] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedTx, setSelectedTx] = useState(null);
  const [txSearch, setTxSearch] = useState("");
  const [txRiskFilter, setTxRiskFilter] = useState("");
  const [txPage, setTxPage] = useState(1);

  const TX_PER_PAGE = 10;

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(`${API}/${id}`);
        const data = await response.json();

        if (!response.ok || !data.success) {
          setError(data.message || "Gagal memuat detail audit");
          return;
        }

        setAudit(data.audit);
        setTransactions(data.transactions || []);
      } catch (error) {
        console.error("FETCH DETAIL ERROR:", error);
        setError("Network error");
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id]);

  const filtered = transactions.filter((tx) => {
    const query = txSearch.toLowerCase();

    const matchesSearch =
      !query ||
      String(tx.tender_title || "")
        .toLowerCase()
        .includes(query) ||
      String(tx.award_title || "")
        .toLowerCase()
        .includes(query) ||
      String(tx.award_supplier || "")
        .toLowerCase()
        .includes(query) ||
      String(tx.nama_daerah || "")
        .toLowerCase()
        .includes(query);

    const matchesRisk =
      !txRiskFilter ||
      String(tx.risk_level || "").toLowerCase() === txRiskFilter;

    return matchesSearch && matchesRisk;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / TX_PER_PAGE));

  const paginated = filtered.slice(
    (txPage - 1) * TX_PER_PAGE,
    txPage * TX_PER_PAGE,
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f3f4f8] font-sans">
        <Navbar variant="internal" />

        <div className="pt-14 flex items-center justify-center h-96">
          <p className="text-gray-500">Memuat detail audit...</p>
        </div>
      </div>
    );
  }

  if (error || !audit) {
    return (
      <div className="min-h-screen bg-[#f3f4f8] font-sans">
        <Navbar variant="internal" />

        <div className="pt-14 flex items-center justify-center h-96">
          <div className="text-center">
            <p className="text-red-600 font-medium">
              {error || "Audit tidak ditemukan"}
            </p>

            <button
              onClick={() => navigate("/analisa")}
              className="mt-4 px-4 py-2 bg-gray-900 text-white text-sm rounded-lg"
            >
              Kembali
            </button>
          </div>
        </div>
      </div>
    );
  }

  const totalAllocation = transactions.reduce(
    (acc, tx) => acc + Number(tx.award_value || 0),
    0,
  );

  const aiEstimate = totalAllocation * 0.74;
  const stateLoss = totalAllocation * 0.26;

  return (
    <>
      <div className="min-h-screen bg-[#f3f4f8] font-sans pt-24">
        <Navbar variant="internal" />

        <TxModal tx={selectedTx} onClose={() => setSelectedTx(null)} />

        <div className="max-w-6xl mx-auto px-6 pb-10">
          {/* BACK */}
          <button
            onClick={() => navigate("/Analisa")}
            className="px-5 py-2.5 rounded-lg bg-[#0B1C30] text-white text-sm mb-2"
          >
              Kembali 
          </button>

          {/* HEADER */}
          <div className="mb-8">
            <div className="flex flex-wrap justify-between gap-6 items-start">
              <div className="max-w-3xl">
                <p className="text-xs uppercase tracking-[0.2em] text-gray-400 mb-3">
                  PROYEK INFRASTRUKTUR STRATEGIS
                </p>

                <div className="border-l-4 border-red-500 pl-5">
                  <h1 className="text-2xl md:text-3xl font-semibold text-slate-900 leading-snug">
                    {transactions?.[0]?.tender_title ||
                      "Tidak ada judul proyek"}
                  </h1>

                  <div className="mt-4 flex flex-wrap gap-3 items-center">
                    <span className="bg-red-100 text-red-700 text-xs font-bold px-3 py-1 rounded">
                      STATUS: KRITIS
                    </span>

                    <span className="text-sm text-gray-400">
                      ID: INFRA-{audit.id}
                    </span>
                  </div>
                </div>
              </div>

              <div className="w-[300px] border border-gray-200 rounded-lg p-5 bg-white shadow-sm">
                <p className="text-xs text-gray-400 uppercase mb-2">
                  ALOKASI TOTAL
                </p>

                <p className="text-2xl font-semibold text-gray-900 leading-tight">
                  Rp {formatNumber(totalAllocation)}
                </p>
              </div>
            </div>
          </div>

          {/* METRICS */}
          <div className="border border-gray-200 rounded-2xl bg-white p-6 mb-8 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900 mb-5">
              Metrik Teknis & Realisasi Keuangan
            </h2>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="border border-gray-200 rounded-2xl p-5 bg-gray-50">
                <p className="text-xs uppercase text-gray-500 mb-3">
                  PENGELUARAN DILAPORKAN
                </p>

                <p className="text-xl font-semibold text-slate-900">
                  Rp {formatNumber(totalAllocation)}
                </p>
              </div>

              <div className="border border-emerald-200 rounded-2xl p-5 bg-emerald-50">
                <p className="text-xs uppercase text-emerald-700 mb-3">
                  ESTIMASI AI / FAIR VALUE
                </p>

                <p className="text-xl font-semibold text-slate-900">
                  Rp {formatNumber(aiEstimate)}
                </p>
              </div>

              <div className="border border-red-300 rounded-2xl p-5 bg-red-50">
                <p className="text-xs uppercase text-red-600 mb-3">
                  POTENSI KERUGIAN NEGARA
                </p>

                <p className="text-xl font-bold text-red-600">
                  Rp {formatNumber(stateLoss)}
                </p>
              </div>
            </div>
          </div>

          {/* TABLE */}
          <div className="border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-sm">
            <div className="p-5 border-b border-gray-100 flex flex-wrap gap-3 justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Riwayat Proyek Vendor
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Daftar histori proyek pengadaan dari vendor yang dianalisis
                  oleh sistem.
                </p>
              </div>

              <div className="flex gap-2 flex-wrap">
                <input
                  type="text"
                  value={txSearch}
                  onChange={(event) => {
                    setTxSearch(event.target.value);
                    setTxPage(1);
                  }}
                  placeholder="Cari proyek, vendor, kategori..."
                  className="border border-gray-200 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-200"
                />

                <select
                  value={txRiskFilter}
                  onChange={(event) => {
                    setTxRiskFilter(event.target.value);
                    setTxPage(1);
                  }}
                  className="border border-gray-200 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-200"
                >
                  <option value="">Semua Risiko</option>
                  <option value="high">Risiko Tinggi</option>
                  <option value="medium">Risiko Sedang</option>
                  <option value="low">Risiko Rendah</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[950px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-gray-100">
                    {[
                      "Nama Proyek",
                      "Vendor",
                      "Kategori",
                      "Nilai Kontrak",
                      "Durasi Tender",
                      "Skor AI",
                      "Level Risiko",
                      "Aksi",
                    ].map((header) => (
                      <th
                        key={header}
                        className="text-left px-5 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {paginated.length > 0 ? (
                    paginated.map((tx, index) => (
                      <tr
                        key={tx.id || index}
                        className={`border-b border-gray-100 hover:bg-slate-50 transition-colors ${
                          index === paginated.length - 1 ? "border-0" : ""
                        }`}
                      >
                        <td className="px-5 py-4">
                          <div className="max-w-[280px]">
                            <p className="text-sm font-semibold text-slate-800 line-clamp-2 leading-relaxed">
                              {tx.tender_title || "-"}
                            </p>

                            <p className="text-xs text-gray-400 mt-1">
                              {tx.nama_daerah || "-"}
                            </p>
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <div className="max-w-[220px]">
                            <p className="text-sm text-gray-700 line-clamp-2">
                              {tx.award_supplier || "-"}
                            </p>
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                            {tx.mainprocurementcategory || "-"}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <p className="text-sm font-semibold text-slate-900">
                            Rp {formatNumber(tx.award_value)}
                          </p>
                        </td>

                        <td className="px-5 py-4">
                          <span className="text-sm text-gray-600">
                            {tx.days_to_award
                              ? `${tx.days_to_award} Hari`
                              : "-"}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-20 bg-gray-200 rounded-full h-2 overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  tx.risk_level === "high"
                                    ? "bg-red-500"
                                    : tx.risk_level === "medium"
                                      ? "bg-orange-400"
                                      : "bg-emerald-500"
                                }`}
                                style={{
                                  width: `${Math.min(
                                    Number(tx.score || 0) * 100,
                                    100,
                                  )}%`,
                                }}
                              />
                            </div>

                            <span className="text-sm font-bold text-slate-800">
                              {formatScore(tx.score)}
                            </span>
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`text-xs font-semibold px-3 py-1 rounded-full ${riskBadge(
                              tx.risk_level,
                            )}`}
                          >
                            {formatRiskLabel(tx.risk_level)}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <button
                            onClick={() => setSelectedTx(tx)}
                            className="px-4 py-2 rounded-xl bg-slate-900 text-white text-sm font-medium hover:bg-slate-700 transition-colors"
                          >
                            Lihat Detail
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="8"
                        className="px-4 py-16 text-center text-sm text-gray-500"
                      >
                        Tidak ada riwayat proyek vendor yang sesuai dengan
                        pencarian.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* PAGINATION */}
            <div className="p-5 border-t border-gray-100 flex items-center justify-between gap-3 flex-wrap bg-white">
              <p className="text-sm text-gray-500">
                Menampilkan{" "}
                <span className="font-semibold text-slate-800">
                  {paginated.length}
                </span>{" "}
                dari{" "}
                <span className="font-semibold text-slate-800">
                  {filtered.length}
                </span>{" "}
                data
              </p>

              <div className="flex items-center gap-2">
                <button
                  disabled={txPage <= 1}
                  onClick={() => setTxPage((prev) => Math.max(1, prev - 1))}
                  className="px-4 py-2 text-sm border border-gray-200 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Sebelumnya
                </button>

                <span className="text-sm text-gray-600 px-2">
                  Halaman {txPage} / {totalPages}
                </span>

                <button
                  disabled={txPage >= totalPages}
                  onClick={() =>
                    setTxPage((prev) => Math.min(totalPages, prev + 1))
                  }
                  className="px-4 py-2 text-sm border border-gray-200 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Berikutnya
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
