import React, { useEffect, useState } from "react";
import axios from "axios";
import RiskMap from "../ui/RiskMap";
import { AlertTriangle, ShieldAlert, Siren } from "lucide-react";

const RiskPublicMapSection = () => {
  const [highRiskLocs, setHighRiskLocs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopRisks = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8005/api/v1/riskMap",
        );

        if (!response.data.success) return;

        const mapped = response.data.data.map((item) => {
          const countDanger = Number(item.count_danger) || 0;
          const totalData = Number(item.total_data) || 0;
          const riskScore = Number(item.index_resiko) || 0;

          const corruptionPercentage =
            totalData > 0 ? Math.round((countDanger / totalData) * 100) : 0;

          return {
            ...item,
            riskScore,
            corruptionPercentage,
          };
        });

        // URUT BERDASARKAN INDEX RESIKO
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
    if (score >= 50) return "#ef4444";
    if (score >= 47) return "#f97316";
    if (score >= 44) return "#facc15";
    return "#22c55e";
  };

  const getRiskStatus = (score) => {
    if (score >= 50) return "CRITICAL";
    if (score >= 47) return "DANGER";
    if (score >= 44) return "WARNING";
    return "SAFE";
  };

  const getRiskIcon = (score) => {
    const status = getRiskStatus(score);
    const color = getRiskColor(score);

    if (status === "CRITICAL") {
      return <Siren className="w-4 h-4" style={{ color }} />;
    }

    if (status === "DANGER") {
      return <ShieldAlert className="w-4 h-4" style={{ color }} />;
    }

    return <AlertTriangle className="w-4 h-4" style={{ color }} />;
  };

  return (
    <section className="max-w-7xl mx-auto px-6 py-20">
      <div className="grid md:grid-cols-3 gap-12 items-start">
        {/* MAP */}
        <div className="md:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden h-[500px]">
          <RiskMap />
        </div>

        {/* SIDEBAR */}
        <div className="pt-8">
          <h2 className="text-3xl font-bold text-gray-900 font-serif mb-4">
            Peta Korupsi
          </h2>

          <p className="text-sm text-gray-500 leading-relaxed mb-8">
            Visualisasi persebaran risiko penyalahgunaan anggaran berdasarkan
            analisis data transaksi dan tender nasional.
          </p>

          <div className="space-y-6">
            <p className="text-xs font-bold tracking-widest text-gray-400 uppercase">
              Indikasi Risiko Tertinggi
            </p>

            {loading ? (
              <div className="text-gray-400 text-xs animate-pulse">
                Memuat data...
              </div>
            ) : highRiskLocs.length > 0 ? (
              highRiskLocs.map((loc, index) => (
                <div
                  key={loc.daerah}
                  className="border border-gray-100 rounded-xl p-4 hover:shadow-md transition"
                >
                  {/* HEADER */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {getRiskIcon(loc.riskScore)}

                      <span className="font-semibold text-sm text-gray-800">
                        {loc.daerah}
                      </span>
                    </div>

                    <span className="text-[10px] px-2 py-1 rounded-full bg-gray-100 text-gray-700 font-bold">
                      TOP {index + 1}
                    </span>
                  </div>

                  {/* SCORE */}
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-gray-500">Index Resiko</span>

                    <span
                      className="font-bold"
                      style={{
                        color: getRiskColor(loc.riskScore),
                      }}
                    >
                      {loc.riskScore}
                    </span>
                  </div>

                  {/* BAR */}
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-2 rounded-full transition-all duration-1000"
                      style={{
                        width: `${Math.min(loc.riskScore * 1.8, 100)}%`,
                        backgroundColor: getRiskColor(loc.riskScore),
                      }}
                    />
                  </div>

                  {/* DETAIL */}
                  <p className="text-[11px] text-gray-400 mt-2">
                    {loc.count_danger} dari {loc.total_data} data terindikasi
                    korupsi ({loc.corruptionPercentage}%)
                  </p>
                </div>
              ))
            ) : (
              <p className="text-xs text-gray-400 italic">
                Data belum tersedia.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default RiskPublicMapSection;
