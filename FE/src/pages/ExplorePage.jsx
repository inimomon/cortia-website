import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/ui/Navbar';

const daerahData = [
  {
    id: 'RA-9901',
    name: 'Daerah Alpha',
    status: 'KRITIS',
    totalAnggaran: 'Rp 4.2T',
    breakdown: { jalan: 45, jembatan: 30, fasilitas: 25 },
    anomaliSkor: 8.9,
  },
  {
    id: 'RB-4420',
    name: 'Daerah Beta',
    status: 'ANOMALI',
    totalAnggaran: 'Rp 1.8T',
    breakdown: { jalan: 60, jembatan: 20, fasilitas: 20 },
    anomaliSkor: 6.2,
  },
  {
    id: 'RG-1022',
    name: 'Daerah Gamma',
    status: 'STABIL',
    totalAnggaran: 'Rp 2.5T',
    breakdown: { jalan: 35, jembatan: 40, fasilitas: 25 },
    anomaliSkor: 1.2,
  },
  {
    id: 'RD-8834',
    name: 'Daerah Delta',
    status: 'STABIL',
    totalAnggaran: 'Rp 950M',
    breakdown: { jalan: 30, jembatan: 35, fasilitas: 35 },
    anomaliSkor: 0.8,
  },
];

const statusConfig = {
  KRITIS: { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-400' },
  ANOMALI: { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-400' },
  STABIL: { bg: 'bg-teal-100', text: 'text-teal-700', border: 'border-teal-400' },
};

const skorColor = (s) => {
  if (s >= 7) return 'text-red-600';
  if (s >= 4) return 'text-orange-500';
  return 'text-gray-500';
};

export default function ExplorePage() {
  const [search, setSearch] = useState('');
  const [tahun, setTahun] = useState('TA 2024');
  const [risiko, setRisiko] = useState('Semua Tingkat');
  const navigate = useNavigate();

  const filtered = daerahData.filter((d) => {
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase()) || d.id.toLowerCase().includes(search.toLowerCase());
    const matchRisiko =
      risiko === 'Semua Tingkat' ||
      (risiko === 'Kritis' && d.status === 'KRITIS') ||
      (risiko === 'Anomali' && d.status === 'ANOMALI') ||
      (risiko === 'Stabil' && d.status === 'STABIL');
    return matchSearch && matchRisiko;
  });

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Navbar variant="internal" />

      <div className="max-w-7xl mx-auto px-6 pt-24 pb-20">
        <h1 className="text-4xl font-bold text-gray-900 mb-2 font-serif">Eksplorasi Anggaran Infrastruktur</h1>
        <p className="text-gray-500 text-sm mb-8">Menganalisis alokasi dana daerah dan mendeteksi anomali fiskal pada proyek infrastruktur.</p>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-8">
          <div className="flex-1 min-w-64 relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Masukkan nama atau kode daerah..."
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gray-300"
            />
          </div>
          <select
            value={tahun}
            onChange={(e) => setTahun(e.target.value)}
            className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm bg-white focus:outline-none"
          >
            {['TA 2024', 'TA 2023', 'TA 2022'].map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
          <select
            value={risiko}
            onChange={(e) => setRisiko(e.target.value)}
            className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm bg-white focus:outline-none"
          >
            {['Semua Tingkat', 'Kritis', 'Anomali', 'Stabil'].map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>
          <button className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm bg-white flex items-center gap-2 hover:bg-gray-50">
            Filter
          </button>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {filtered.map((d) => {
            const cfg = statusConfig[d.status];
            return (
              <div key={d.id} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-1">
                  <h3 className="font-bold text-gray-900">{d.name}</h3>
                  <span className={`text-xs font-semibold px-2 py-1 rounded ${cfg.bg} ${cfg.text} flex items-center gap-1`}>
                    {d.status}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mb-3">ID: {d.id}</p>
                <div className={`border-t-2 ${cfg.border} mb-3`} />
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Total Anggaran</p>
                <p className="text-2xl font-bold text-gray-900 mb-4">{d.totalAnggaran}</p>
                <div className="space-y-1.5 mb-4">
                  {[
                    ['Pembangunan Jalan', d.breakdown.jalan],
                    ['Proyek Jembatan', d.breakdown.jembatan],
                    ['Fasilitas Umum', d.breakdown.fasilitas],
                  ].map(([label, val]) => (
                    <div key={label} className="flex justify-between text-xs text-gray-600">
                      <span>{label}</span>
                      <span>{val}%</span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div>
                    <p className="text-xs text-gray-400">SKOR ANOMALI</p>
                    <p className={`font-bold text-sm ${skorColor(d.anomaliSkor)}`}>{d.anomaliSkor}/10</p>
                  </div>
                  <button
                    onClick={() => navigate(`/detail-prov/${d.id}`)}
                    className="text-sm text-gray-700 font-medium hover:text-gray-900 flex items-center gap-1"
                  >
                    Detail →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}