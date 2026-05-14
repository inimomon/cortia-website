import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/ui/Navbar';

const API = 'http://localhost:8123/api/audit';

const riskBadge = (level) => {
  const normalized = String(level || '').toLowerCase();
  const map = {
    high: 'bg-red-100 text-red-700 border border-red-200',
    medium: 'bg-orange-100 text-orange-700 border border-orange-200',
    low: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
  };
  return map[normalized] || 'bg-gray-100 text-gray-600';
};

function TxModal({ tx, onClose }) {
  if (!tx) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-6" onClick={(event) => event.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">Prediction Detail</p>
            <h2 className="text-lg font-bold text-gray-900">{tx.tender_title || 'Untitled row'}</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 text-xl font-light">x</button>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-5">
          {[
            ['Nama Daerah', tx.nama_daerah || '-'],
            ['Award Date', tx.award_date || '-'],
            ['Tender Min Value', tx.tender_minvalue ? Number(tx.tender_minvalue).toLocaleString('id-ID') : '-'],
            ['Award Value', tx.award_value ? Number(tx.award_value).toLocaleString('id-ID') : '-'],
            ['Award Supplier', tx.award_supplier || '-'],
            ['Days To Award', tx.days_to_award ?? '-'],
            ['Category', tx.mainprocurementcategory || '-'],
            ['Award Title', tx.award_title || '-'],
          ].map(([label, value]) => (
            <div key={label}>
              <p className="text-xs text-gray-400 mb-0.5">{label}</p>
              <p className="text-sm text-gray-800 font-medium break-words">{value}</p>
            </div>
          ))}
        </div>

        <div className="bg-gray-50 rounded-xl p-4 mb-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">FastAPI Score</p>
              <p className="text-3xl font-bold text-gray-900">
                {typeof tx.score === 'number' ? tx.score.toFixed(4) : '-'}
              </p>
            </div>
            <span className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${riskBadge(tx.risk_level)}`}>
              {tx.risk_level || 'unknown'}
            </span>
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Explanation</p>
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans">{tx.explanation || 'No explanation returned by FastAPI.'}</pre>
          </div>
        </div>

        <div className="mt-5 flex justify-end">
          <button onClick={onClose} className="px-5 py-2 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-700 transition-colors">Close</button>
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
  const [error, setError] = useState('');
  const [selectedTx, setSelectedTx] = useState(null);
  const [txSearch, setTxSearch] = useState('');
  const [txRiskFilter, setTxRiskFilter] = useState('');
  const [txPage, setTxPage] = useState(1);
  const TX_PER_PAGE = 10;

  useEffect(() => {
    fetch(`${API}/${id}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setAudit(data.audit);
          setTransactions(data.transactions);
        } else {
          setError(data.message || 'Failed to load');
        }
      })
      .catch(() => setError('Network error'))
      .finally(() => setLoading(false));
  }, [id]);

  const filtered = transactions.filter((tx) => {
    const query = txSearch.toLowerCase();
    const matchesSearch =
      !query ||
      tx.tender_title?.toLowerCase().includes(query) ||
      tx.award_title?.toLowerCase().includes(query) ||
      tx.award_supplier?.toLowerCase().includes(query) ||
      tx.nama_daerah?.toLowerCase().includes(query);
    const matchesRisk = !txRiskFilter || tx.risk_level === txRiskFilter;
    return matchesSearch && matchesRisk;
  });

  const totalPages = Math.ceil(filtered.length / TX_PER_PAGE);
  const paginated = filtered.slice((txPage - 1) * TX_PER_PAGE, txPage * TX_PER_PAGE);

  if (loading) return (
    <div className="min-h-screen bg-white font-sans">
      <Navbar variant="internal" />
      <div className="pt-14 flex items-center justify-center h-96">
        <div className="text-center"><div className="text-4xl mb-3">...</div><p className="text-gray-500">Loading audit...</p></div>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-white font-sans">
      <Navbar variant="internal" />
      <div className="pt-14 flex items-center justify-center h-96">
        <div className="text-center">
          <div className="text-4xl mb-3">!</div>
          <p className="text-red-600 font-medium">{error}</p>
          <button onClick={() => navigate('/audit')} className="mt-4 px-4 py-2 bg-gray-900 text-white text-sm rounded-lg">Back to Audit</button>
        </div>
      </div>
    </div>
  );

  const highPct = audit.total_rows ? Math.round((audit.high_risk / audit.total_rows) * 100) : 0;
  const medPct = audit.total_rows ? Math.round((audit.medium_risk / audit.total_rows) * 100) : 0;
  const lowPct = audit.total_rows ? Math.round((audit.low_risk / audit.total_rows) * 100) : 0;

  return (
    <div className="min-h-screen bg-white font-sans">
      <Navbar variant="internal" />
      <TxModal tx={selectedTx} onClose={() => setSelectedTx(null)} />

      <section className="pt-14">
        <div className="bg-gray-900 text-white">
          <div className="max-w-5xl mx-auto px-6 py-10">
            <button onClick={() => navigate('/audit')} className="text-gray-400 hover:text-white text-sm mb-4 flex items-center gap-1 transition-colors">
              Back to Audit
            </button>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">Audit ID #{audit.id}</p>
                <h1 className="text-2xl font-bold font-serif">{audit.filename}</h1>
                <p className="text-gray-400 text-sm mt-1">
                  {new Date(audit.created_at).toLocaleString('id-ID')} · {audit.total_rows} rows
                </p>
              </div>
              <span className={`text-xs font-semibold px-3 py-1.5 rounded-full capitalize mt-1 ${
                audit.status === 'completed'
                  ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-600/30'
                  : audit.status === 'failed'
                    ? 'bg-red-600/20 text-red-400'
                    : 'bg-blue-600/20 text-blue-400'
              }`}
              >
                {audit.status}
              </span>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Rows', value: audit.total_rows, color: 'text-gray-900', bg: 'bg-gray-50', border: 'border-gray-200' },
            { label: 'High', value: audit.high_risk, sub: `${highPct}%`, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-100' },
            { label: 'Medium', value: audit.medium_risk, sub: `${medPct}%`, color: 'text-orange-500', bg: 'bg-orange-50', border: 'border-orange-100' },
            { label: 'Low', value: audit.low_risk, sub: `${lowPct}%`, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
          ].map((card) => (
            <div key={card.label} className={`${card.bg} border ${card.border} rounded-xl p-4`}>
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">{card.label}</p>
              <p className={`text-3xl font-bold ${card.color}`}>{card.value}</p>
              {card.sub && <p className={`text-xs mt-1 ${card.color} opacity-70`}>{card.sub} of total</p>}
            </div>
          ))}
        </div>

        {audit.total_rows > 0 && (
          <div className="mb-8 border border-gray-200 rounded-xl p-5">
            <p className="text-sm font-semibold text-gray-700 mb-3">Risk Distribution</p>
            <div className="flex h-4 rounded-full overflow-hidden gap-0.5">
              {highPct > 0 && <div className="bg-red-500 transition-all" style={{ width: `${highPct}%` }} title={`High: ${highPct}%`} />}
              {medPct > 0 && <div className="bg-orange-400 transition-all" style={{ width: `${medPct}%` }} title={`Medium: ${medPct}%`} />}
              {lowPct > 0 && <div className="bg-emerald-500 transition-all" style={{ width: `${lowPct}%` }} title={`Low: ${lowPct}%`} />}
            </div>
            <div className="flex gap-4 mt-2 text-xs text-gray-500">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500 inline-block" /> High {highPct}%</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-orange-400 inline-block" /> Medium {medPct}%</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /> Low {lowPct}%</span>
            </div>
          </div>
        )}

        <div>
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <h2 className="text-lg font-bold text-gray-900 font-serif">Prediction Rows</h2>
            <div className="flex gap-2">
              <input
                type="text"
                value={txSearch}
                onChange={(event) => {
                  setTxSearch(event.target.value);
                  setTxPage(1);
                }}
                placeholder="Search title, supplier, nama_daerah..."
                className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 w-60"
              />
              <select
                value={txRiskFilter}
                onChange={(event) => {
                  setTxRiskFilter(event.target.value);
                  setTxPage(1);
                }}
                className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none text-gray-600"
              >
                <option value="">All Risk</option>
                <option value="high">high</option>
                <option value="medium">medium</option>
                <option value="low">low</option>
              </select>
            </div>
          </div>

          <div className="border border-gray-200 rounded-xl overflow-hidden">
            {paginated.length === 0 ? (
              <div className="py-12 text-center text-gray-400 text-sm">No rows found.</div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    {['Tender Title', 'Supplier', 'Category', 'Award Value', 'Days', 'Score', 'Risk', 'Detail'].map((header) => (
                      <th key={header} className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide whitespace-nowrap">{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((tx, index) => (
                    <tr key={tx.id} className={`border-b border-gray-50 hover:bg-gray-50 transition-colors ${index === paginated.length - 1 ? 'border-0' : ''}`}>
                      <td className="px-4 py-3 text-sm text-gray-800 max-w-[240px]" title={tx.tender_title}>{tx.tender_title || '-'}</td>
                      <td className="px-4 py-3 text-sm text-gray-600 max-w-[160px]" title={tx.award_supplier}>{tx.award_supplier || '-'}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{tx.mainprocurementcategory || '-'}</td>
                      <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">
                        {tx.award_value ? Number(tx.award_value).toLocaleString('id-ID') : '-'}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{tx.days_to_award ?? '-'}</td>
                      <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                        {typeof tx.score === 'number' ? tx.score.toFixed(4) : '-'}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded capitalize ${riskBadge(tx.risk_level)}`}>{tx.risk_level || 'unknown'}</span>
                      </td>
                      <td className="px-4 py-3">
                        <button onClick={() => setSelectedTx(tx)} className="text-sm text-teal-700 font-medium hover:text-teal-900 whitespace-nowrap">
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-4">
              <button onClick={() => setTxPage((current) => Math.max(1, current - 1))} disabled={txPage === 1} className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40">Prev</button>
              <span className="text-sm text-gray-500">{txPage} / {totalPages}</span>
              <button onClick={() => setTxPage((current) => Math.min(totalPages, current + 1))} disabled={txPage === totalPages} className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40">Next</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
