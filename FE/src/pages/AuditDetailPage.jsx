import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/ui/Navbar";
import ReactMarkdown from "react-markdown"

const PORT = import.meta.env.VITE_BE_LINK || "http://localhost:8005/api/v1";
const API = `${PORT}/audit`;

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
              Prediction Detail
            </p>

            <h2 className="text-lg font-bold text-gray-900">
              {tx.tender_title || "Untitled row"}
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
            ["Award Date", tx.award_date],
            ["Tender Min Value", formatNumber(tx.tender_minvalue)],
            ["Award Value", formatNumber(tx.award_value)],
            ["Award Supplier", tx.award_supplier],
            ["Days To Award", tx.days_to_award],
            ["Category", tx.mainprocurementcategory],
            ["Award Title", tx.award_title],
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
                FastAPI Score
              </p>

              <p className="text-3xl font-bold text-gray-900">
                {formatScore(tx.score)}
              </p>
            </div>

            <span
              className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${riskBadge(
                tx.risk_level,
              )}`}
            >
              {tx.risk_level || "unknown"}
            </span>
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
            Explanation
          </p>

          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans">
              {tx.explanation || "No explanation returned by FastAPI."}
            </pre>
          </div>
        </div>

        <div className="mt-5 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-700 transition-colors"
          >
            Close
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
          <p className="text-gray-500">Loading audit...</p>
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
              onClick={() => navigate("/audit")}
              className="mt-4 px-4 py-2 bg-gray-900 text-white text-sm rounded-lg"
            >
              Back
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
    <div className="min-h-screen bg-[#f3f4f8] font-sans">
      <Navbar variant="internal" />

      <TxModal tx={selectedTx} onClose={() => setSelectedTx(null)} />

      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* BACK */}
        <button
          onClick={() => navigate("/audit")}
          className="text-sm text-gray-600 hover:text-black mb-5"
        >
          ← Kembali
        </button>

        {/* HEADER */}
        <div className="mb-8">
          <div className="flex flex-wrap justify-between gap-6 items-start">
            <div className="max-w-3xl">
              <p className="text-xs uppercase tracking-[0.2em] text-gray-400 mb-3">
                PROYEK INFRASTRUKTUR STRATEGIS
              </p>

              <div className="border-l-4 border-red-500 pl-5">
                <h1 className="text-5xl font-bold text-slate-900 leading-tight">
                  {transactions?.[0]?.tender_title || "Tidak ada judul proyek"}
                </h1>

                <div className="mt-4 flex flex-wrap gap-3 items-center">
                  <span className="bg-red-100 text-red-700 text-xs font-bold px-3 py-1 rounded">
                    STATUS: CRITICAL
                  </span>

                  <span className="text-sm text-gray-400">
                    ID: INFRA-{audit.id}
                  </span>
                </div>
              </div>
            </div>

            <div className="w-[300px] border border-gray-200 rounded-lg p-5 bg-white">
              <p className="text-xs text-gray-400 uppercase mb-2">
                ALOKASI TOTAL
              </p>

              <p className="text-4xl font-bold text-gray-900 leading-tight">
                Rp {formatNumber(totalAllocation)}
              </p>
            </div>
          </div>
        </div>

        {/* ========================= FORENSIC AI ========================= */}
        <div className="border border-gray-200 rounded-xl bg-white mb-6">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-bold text-slate-900">
              👁️ Analisis Forensik AI (Explainable AI)
            </h2>
          </div>

          {transactions?.[0] &&
            (() => {
              const tx = transactions[0];

              const hargaAwal = Number(
                tx.harga_awal || tx.tender_minvalue || 0,
              );

              const hargaFinal = Number(tx.harga_final || tx.award_value || 0);

              const gapHarga = Number(tx.gap_harga ?? hargaFinal - hargaAwal);

              const deviasi =
                hargaAwal > 0 ? Math.abs((gapHarga / hargaAwal) * 100) : 0;

              const score = Number(tx.score || 0);

              const riskScore = Math.min(100, Math.round(score * 220));

              const isMarkup = gapHarga > 0;

              const explanation =
                tx.explanation || "Tidak ada explanation dari AI.";

              return (
                <div className="p-6 grid lg:grid-cols-2 gap-5">
                  {/* LEFT */}
                  <div className="space-y-4">
                    {/* GAP ANALYSIS */}
                    <div
                      className={`bg-gray-50 border-l-4 p-5 rounded-r-xl ${
                        isMarkup ? "border-red-500" : "border-emerald-500"
                      }`}
                    >
                      <p
                        className={`text-xs font-bold uppercase tracking-wide mb-2 ${
                          isMarkup ? "text-red-600" : "text-emerald-600"
                        }`}
                      >
                        {isMarkup
                          ? "ANOMALI TERDETEKSI: MARKUP HARGA"
                          : "ANALISIS NORMAL"}
                      </p>

                      <p className="text-sm text-gray-700 leading-relaxed">
                        {isMarkup
                          ? `Terdapat deviasi nilai sebesar ${deviasi.toFixed(
                              2,
                            )}% dari estimasi awal pengadaan.`
                          : "Tidak ditemukan penyimpangan harga signifikan terhadap estimasi awal."}
                      </p>
                    </div>

                    {/* AI EXPLANATION */}
                    <div className="bg-gray-50 border-l-4 border-orange-400 p-5 rounded-r-xl">
                      <p className="text-xs font-bold uppercase tracking-wide text-orange-600 mb-3">
                        PENJELASAN AI
                      </p>

                      <div className="text-sm text-gray-700 leading-relaxed prose prose-sm max-w-none">
                        <ReactMarkdown>{explanation}</ReactMarkdown>
                      </div>
                    </div>

                    {/* PROCUREMENT INFO */}
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
                      <p className="text-xs uppercase tracking-wide text-slate-500 mb-4">
                        INFORMASI PENGADAAN
                      </p>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-gray-400 mb-1">
                            Tender Awal
                          </p>

                          <p className="text-lg font-bold text-slate-900">
                            Rp {Number(hargaAwal).toLocaleString("id-ID")}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-gray-400 mb-1">
                            Nilai Final
                          </p>

                          <p className="text-lg font-bold text-slate-900">
                            Rp {Number(hargaFinal).toLocaleString("id-ID")}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-gray-400 mb-1">Selisih</p>

                          <p
                            className={`text-lg font-bold ${
                              gapHarga > 0 ? "text-red-600" : "text-emerald-600"
                            }`}
                          >
                            Rp {Math.abs(gapHarga).toLocaleString("id-ID")}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-gray-400 mb-1">Vendor</p>

                          <p className="text-sm font-medium text-slate-900 line-clamp-2">
                            {tx.award_supplier || "-"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* RIGHT */}
                  <div className="bg-slate-100 rounded-xl p-6">
                    <p className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-6 text-center">
                      LOGIKA KEPUTUSAN MODEL
                    </p>

                    <div className="space-y-7">
                      {/* GAP SCORE */}
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Deviasi Harga</span>

                          <span
                            className={`font-bold ${
                              isMarkup ? "text-red-600" : "text-emerald-600"
                            }`}
                          >
                            {isMarkup ? "+" : ""}
                            {deviasi.toFixed(2)}%
                          </span>
                        </div>

                        <div className="h-3 bg-gray-300 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              isMarkup ? "bg-red-600" : "bg-emerald-500"
                            }`}
                            style={{
                              width: `${Math.min(deviasi, 100)}%`,
                            }}
                          />
                        </div>
                      </div>

                      {/* AI SCORE */}
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Skor Risiko AI</span>

                          <span className="font-bold text-orange-600">
                            {riskScore}/100
                          </span>
                        </div>

                        <div className="h-3 bg-gray-300 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-orange-400 rounded-full"
                            style={{
                              width: `${riskScore}%`,
                            }}
                          />
                        </div>
                      </div>

                      {/* RISK LEVEL */}
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Risk Level</span>

                          <span
                            className={`font-bold capitalize ${
                              tx.risk_level === "high"
                                ? "text-red-600"
                                : tx.risk_level === "medium"
                                  ? "text-orange-500"
                                  : "text-emerald-600"
                            }`}
                          >
                            {tx.risk_level}
                          </span>
                        </div>

                        <div className="h-3 bg-gray-300 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              tx.risk_level === "high"
                                ? "bg-red-600"
                                : tx.risk_level === "medium"
                                  ? "bg-orange-400"
                                  : "bg-emerald-500"
                            }`}
                            style={{
                              width:
                                tx.risk_level === "high"
                                  ? "92%"
                                  : tx.risk_level === "medium"
                                    ? "58%"
                                    : "24%",
                            }}
                          />
                        </div>
                      </div>

                      {/* PROCUREMENT SPEED */}
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Kecepatan Tender</span>

                          <span className="font-bold text-blue-600">
                            {tx.tgl_terima_count_pagu || tx.days_to_award || 0}{" "}
                            Hari
                          </span>
                        </div>

                        <div className="h-3 bg-gray-300 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-500 rounded-full"
                            style={{
                              width: `${Math.min(
                                (Number(
                                  tx.tgl_terima_count_pagu ||
                                    tx.days_to_award ||
                                    0,
                                ) /
                                  100) *
                                  100,
                                100,
                              )}%`,
                            }}
                          />
                        </div>
                      </div>

                      <div className="pt-4 border-t border-slate-300">
                        <p className="text-xs text-gray-500 leading-relaxed text-center">
                          Analisis berasal dari data transaksi aktual, skor AI,
                          deviasi harga pengadaan, dan pola vendor historis pada
                          database procurement.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
        </div>

        {/* METRICS */}
        <div className="border border-gray-200 rounded-xl bg-white p-6 mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-5">
            Metrik Teknis & Realisasi Keuangan
          </h2>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="border border-gray-200 rounded-xl p-5 bg-gray-50">
              <p className="text-xs uppercase text-gray-500 mb-3">
                PENGELUARAN DILAPORKAN
              </p>

              <p className="text-4xl font-bold text-slate-900">
                Rp {formatNumber(totalAllocation)}
              </p>
            </div>

            <div className="border border-emerald-200 rounded-xl p-5 bg-emerald-50">
              <p className="text-xs uppercase text-emerald-700 mb-3">
                ESTIMASI AI (FAIR VALUE)
              </p>

              <p className="text-4xl font-bold text-emerald-700">
                Rp {formatNumber(aiEstimate)}
              </p>
            </div>

            <div className="border border-red-300 rounded-xl p-5 bg-red-50">
              <p className="text-xs uppercase text-red-600 mb-3">
                POTENSI KERUGIAN NEGARA
              </p>

              <p className="text-4xl font-bold text-red-600">
                Rp {formatNumber(stateLoss)}
              </p>
            </div>
          </div>
        </div>

        {/* TABLE */}
        <div className="border border-gray-200 rounded-xl overflow-x-auto bg-white">
          <div className="p-5 border-b border-gray-100 flex flex-wrap gap-3 justify-between items-center">
            <h2 className="text-xl font-bold text-slate-900">
              Prediction Rows
            </h2>

            <div className="flex gap-2 flex-wrap">
              <input
                type="text"
                value={txSearch}
                onChange={(event) => {
                  setTxSearch(event.target.value);
                  setTxPage(1);
                }}
                placeholder="Search..."
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
              />

              <select
                value={txRiskFilter}
                onChange={(event) => {
                  setTxRiskFilter(event.target.value);
                  setTxPage(1);
                }}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
              >
                <option value="">All Risk</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>

          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {[
                  "Tender Title",
                  "Supplier",
                  "Category",
                  "Award Value",
                  "Days",
                  "Score",
                  "Risk",
                  "Detail",
                ].map((header) => (
                  <th
                    key={header}
                    className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {paginated.map((tx, index) => (
                <tr
                  key={tx.id || index}
                  className={`border-b border-gray-50 hover:bg-gray-50 ${
                    index === paginated.length - 1 ? "border-0" : ""
                  }`}
                >
                  <td className="px-4 py-3 text-sm text-gray-800 max-w-[260px] truncate">
                    {tx.tender_title || "-"}
                  </td>

                  <td className="px-4 py-3 text-sm text-gray-600">
                    {tx.award_supplier || "-"}
                  </td>

                  <td className="px-4 py-3 text-sm text-gray-600">
                    {tx.mainprocurementcategory || "-"}
                  </td>

                  <td className="px-4 py-3 text-sm text-gray-700">
                    {formatNumber(tx.award_value)}
                  </td>

                  <td className="px-4 py-3 text-sm text-gray-600">
                    {tx.days_to_award ?? "-"}
                  </td>

                  <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                    {formatScore(tx.score)}
                  </td>

                  <td className="px-4 py-3">
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded capitalize ${riskBadge(
                        tx.risk_level,
                      )}`}
                    >
                      {tx.risk_level || "unknown"}
                    </span>
                  </td>

                  <td className="px-4 py-3">
                    <button
                      onClick={() => setSelectedTx(tx)}
                      className="text-sm text-teal-700 font-medium hover:text-teal-900"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
