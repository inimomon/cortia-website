import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/ui/Navbar';
import { fetchProvinceSummaries } from '../lib/predictionApi';

const statusConfig = {
  KRITIS: { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-400' },
  ANOMALI: { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-400' },
  STABIL: { bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-400' },
};

const skorColor = (score) => {
  if (score >= 7) return 'text-red-600';
  if (score >= 4) return 'text-orange-500';
  return 'text-emerald-600';
};

export default function ExplorePage() {
  const [search, setSearch] = useState('');
  const [risiko, setRisiko] = useState('Semua Tingkat');
  const [tahun, setTahun] = useState('Semua Tahun');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;

    fetchProvinceSummaries()
      .then((response) => {
        if (!active) return;
        if (response.success) {
          setData(response.data || []);
        } else {
          setError('Data provinsi gagal dimuat.');
        }
      })
      .catch(() => {
        if (active) {
          setError('Backend prediction belum bisa diakses.');
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const filtered = useMemo(() => {
    return data.filter((province) => {
      const query = search.trim().toLowerCase();
      const matchSearch =
        !query ||
        province.daerah.toLowerCase().includes(query) ||
        province.key.toLowerCase().includes(query);

      const matchRisiko =
        risiko === 'Semua Tingkat' ||
        (risiko === 'Kritis' && province.status === 'KRITIS') ||
        (risiko === 'Anomali' && province.status === 'ANOMALI') ||
        (risiko === 'Stabil' && province.status === 'STABIL');

      return matchSearch && matchRisiko;
    });
  }, [data, risiko, search]);

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Navbar variant="internal" />

      <div className="max-w-7xl mx-auto px-6 pt-24 pb-20">
        <h1 className="text-4xl font-bold text-gray-900 mb-2 font-serif">Eksplorasi Anggaran Infrastruktur</h1>
        <p className="text-gray-500 text-sm mb-8">
          Jelajahi ringkasan pengeluaran, jumlah proyek, dan potensi anomali pengadaan per provinsi berdasarkan data prediction.
        </p>

        <div className="flex flex-wrap gap-3 mb-8">
          <div className="flex-1 min-w-64 relative">
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Masukkan nama provinsi atau key daerah..."
              className="w-full pl-4 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gray-300"
            />
          </div>
          <select
            value={tahun}
            onChange={(event) => setTahun(event.target.value)}
            className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm bg-white focus:outline-none"
          >
            {['Semua Tahun'].map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
          <select
            value={risiko}
            onChange={(event) => setRisiko(event.target.value)}
            className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm bg-white focus:outline-none"
          >
            {['Semua Tingkat', 'Kritis', 'Anomali', 'Stabil'].map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </div>

        {loading && (
          <div className="bg-white border border-gray-200 rounded-xl p-10 text-center text-gray-500">
            Memuat ringkasan provinsi...
          </div>
        )}

        {!loading && error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-red-700">
            {error}
          </div>
        )}

        {!loading && !error && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((province) => {
              const cfg = statusConfig[province.status] || statusConfig.STABIL;
              return (
                <div key={province.key} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-1 gap-3">
                    <h3 className="font-bold text-gray-900 text-lg">{province.daerah}</h3>
                    <span className={`text-xs font-semibold px-2 py-1 rounded ${cfg.bg} ${cfg.text} flex items-center gap-1`}>
                      {province.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mb-3">Group by daerah: {province.key}</p>
                  <div className={`border-t-2 ${cfg.border} mb-3`} />

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Total Anggaran</p>
                      <p className="text-lg font-bold text-gray-900">{province.totalAnggaranFormatted}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Total Proyek</p>
                      <p className="text-lg font-bold text-gray-900">{province.totalProyek}</p>
                    </div>
                  </div>

                  <div className="space-y-1.5 mb-4">
                    {province.categoryBreakdown.length > 0 ? (
                      province.categoryBreakdown.map((item) => (
                        <div key={item.name} className="flex justify-between gap-3 text-xs text-gray-600">
                          <span className="truncate">{item.name}</span>
                          <span>{item.percentage}%</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-gray-400">Belum ada kategori proyek.</p>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div>
                      <p className="text-xs text-gray-400">SKOR ANOMALI</p>
                      <p className={`font-bold text-sm ${skorColor(province.skorAnomali)}`}>{province.skorAnomali}/10</p>
                    </div>
                    <button
                      onClick={() => navigate(`/detail-prov/${province.key}`)}
                      className="text-sm text-gray-700 font-medium hover:text-gray-900 flex items-center gap-1"
                    >
                      Lihat detail
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="bg-white border border-gray-200 rounded-xl p-10 text-center text-gray-500">
            Tidak ada provinsi yang cocok dengan filter saat ini.
          </div>
        )}
      </div>
    </div>
  );
}
