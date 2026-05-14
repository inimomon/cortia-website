import React, { useEffect, useState } from "react";
import axios from "axios";
import RiskMap from "../ui/RiskMap";

const RiskPublicMapSection = () => {
  const [highRiskLocs, setHighRiskLocs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopRisks = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BE_LINK}/riskMap`,
        );
        if (!response.data.success) return;

        const mapped = response.data.data.map((item) => {
          const countDanger = Number(item.count_danger) || 0;
          const totalData = Number(item.total_data) || 0;
          const riskScore = Number(item.index_resiko) || 0;
          const corruptionPercentage =
            totalData > 0 ? Math.round((countDanger / totalData) * 100) : 0;
          return { ...item, riskScore, corruptionPercentage };
        });

        const sorted = mapped
          .sort((a, b) => b.riskScore - a.riskScore)
          .slice(0, 5);
        setHighRiskLocs(sorted);
      } catch (err) {
        console.error("Gagal mengambil data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTopRisks();
  }, []);

  const getRiskColor = (score) => {
    if (score >= 20) return "#ef4444";
    if (score >= 17) return "#f97316";
    if (score >= 14) return "#facc15";
    return "#22c55e";
  };

  return (
    <section className="max-w-7xl mx-auto px-6 py-20">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-4xl font-bold text-gray-900 mb-2">
          Pemetaan Potensi Penyalahgunaan Anggaran
        </h2>
        <p className="text-sm text-gray-500 max-w-sm leading-relaxed">
          Visualisasi persebaran risiko penyalahgunaan anggaran berdasarkan
          analisis data transaksi dan tender nasional.
        </p>
      </div>

      {/* Card besar */}
      <div className="border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        {/* MAP + SIDEBAR — flex row di desktop, flex col di mobile */}
        <div className="flex flex-col md:flex-row md:h-[520px]">
          {/* MAP — atas di mobile, kiri di desktop */}
          <div className="w-full h-[300px] md:h-auto md:flex-1 border-b md:border-b-0 md:border-r border-gray-200 bg-white">
            <RiskMap />
          </div>

          {/* SIDEBAR — bawah di mobile, kanan di desktop */}
          <div className="w-full md:w-72 bg-white p-5">
            <h3 className="text-base font-bold text-gray-900 mb-5">
              Risiko Tertinggi
            </h3>

            {loading ? (
              <div className="text-gray-400 text-xs animate-pulse">
                Memuat data...
              </div>
            ) : highRiskLocs.length > 0 ? (
              <div className="space-y-5">
                {highRiskLocs.map((loc) => (
                  <div key={loc.daerah}>
                    {/* Nama + persentase */}
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-gray-700 font-medium">
                        {loc.daerah}
                      </span>
                      <span
                        className="text-xs font-bold"
                        style={{ color: getRiskColor(loc.riskScore) }}
                      >
                        {loc.corruptionPercentage}%
                      </span>
                    </div>

                    {/* Progress bar */}
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-1.5 rounded-full transition-all duration-700"
                        style={{
                          width: `${Math.min(loc.corruptionPercentage, 100)}%`,
                          backgroundColor: getRiskColor(loc.riskScore),
                        }}
                      />
                    </div>

                    {/* Keterangan jumlah */}
                    <p className="text-[11px] text-gray-400 mt-1">
                      {loc.count_danger} dari {loc.total_data} data terindikasi
                      korupsi
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-400 italic">
                Data belum tersedia.
              </p>
            )}

            {/* Legend */}
            <div className="mt-4">
              <p className="text-xs font-bold text-gray-700 mb-3">
                Indikator Risiko
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 flex-shrink-0" />
                  <span className="text-xs text-gray-500">Indeks tinggi</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-orange-400 flex-shrink-0" />
                  <span className="text-xs text-gray-500">Indeks sedang</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500 flex-shrink-0" />
                  <span className="text-xs text-gray-500">Indeks rendah</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer card */}
        <div className="border-t border-gray-200 bg-white px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs text-gray-500 font-medium">
              LIVE · Update 5 menit lalu
            </span>
          </div>
          <a href="/dashboard" className="bg-gray-900 text-white text-xs font-semibold px-5 py-2 rounded-lg hover:bg-gray-700 transition">
            Buka Dashboard
          </a>
        </div>
      </div>
    </section>
  );
};

export default RiskPublicMapSection;
