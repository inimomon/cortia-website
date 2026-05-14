import React from 'react';

const ProvinceDetail = ({ selected }) => {
  if (!selected) return null;

  const anomalyTypes = [
    { label: 'Pengadaan', pct: 55, color: 'bg-blue-500' },
    { label: 'Bantuan Sosial', pct: 30, color: 'bg-teal-500' },
    { label: 'Perjalanan Dinas', pct: 15, color: 'bg-gray-400' },
  ];

  const statusStyles = {
    kritis: 'bg-red-100 text-red-700',
    anomali: 'bg-orange-100 text-orange-700',
    stabil: 'bg-green-100 text-green-700',
  };

  return (
    <section className="border border-gray-200 rounded-xl p-6 mb-10 bg-white">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-bold text-gray-900 font-serif">
          Detail Anggaran: {selected.name}
        </h2>
        <span className={`text-xs font-semibold px-2 py-1 rounded uppercase ${statusStyles[selected.status]}`}>
          STATUS: {selected.status.toUpperCase()}
        </span>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <div>
          <p className="text-xs text-gray-400">Total Anggaran</p>
          <p className="text-2xl font-bold text-gray-900">{selected.dana}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400">Proyek Aktif</p>
          <p className="text-2xl font-bold text-gray-900">245</p>
        </div>
        <div>
          <p className="text-xs text-red-500 font-medium">
            Anomali Terdeteksi ({selected.anomali.toLocaleString()} Kasus)
          </p>
          <p className="text-2xl font-bold text-red-600">IDR 850B</p>
        </div>
      </div>

      <div>
        <p className="text-xs uppercase tracking-wide text-gray-400 mb-3">
          Sebaran Jenis Anomali
        </p>
        <div className="space-y-3">
          {anomalyTypes.map((b) => (
            <div key={b.label}>
              <div className="flex justify-between text-xs text-gray-600 mb-1">
                <span>{b.label}</span>
                <span>{b.pct}%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded">
                <div 
                  className={`h-2 rounded ${b.color}`} 
                  style={{ width: `${b.pct}%` }} 
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProvinceDetail;