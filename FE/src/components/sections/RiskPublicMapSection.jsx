import React, {useState, useEffect} from 'react';
import axios from 'axios';
import RiskMap from '../ui/RiskMap';

const RiskPublicMapSection = () => {
  // const highRiskLocs = [
  //   { name: 'DKI Jakarta', score: 89 }, 
  //   { name: 'Jawa Barat', score: 76 },
  //   { name: 'Sumatera Utara', score: 68 },
  // ];

  const [highRiskLocs, setHighRiskLocs] = useState([]);
  const [loading, setLoading] = useState(true);

  // 2. Fetch the Top 3 data from your new API endpoint
  useEffect(() => {
    const fetchTopRisks = async () => {
      try {
        const response = await axios.get("http://localhost:8123/api/risk-map/top-3");
        
        if (response.data.success) {
          setHighRiskLocs(response.data.data);
        }
      } catch (err) {
        console.error("Gagal mengambil data risiko tertinggi:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTopRisks();
  }, []);

  const getRiskColor = (score) => {
    if (score >= 75) return "#ef4444"; 
    if (score >= 50) return "#facc15"; 
    return "#22c55e";
  };

  return (
    <section className="max-w-7xl mx-auto px-6 py-20">
      <div className="grid md:grid-cols-3 gap-12 items-start">
        {/* Left: Interactive Map */}
        <div className="md:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden h-[500px]">
          <RiskMap />
        </div>

        {/* Right: Sidebar Info */}
        <div className="pt-8">
          <h2 className="text-3xl font-bold text-gray-900 font-serif mb-4">
            Peta Korupsi
          </h2>
          <p className="text-sm text-gray-500 leading-relaxed mb-8">
            Visualisasi persebaran risiko penyalahgunaan anggaran berdasarkan pengawasan data transaksi di seluruh wilayah Indonesia.
          </p>

          <div className="space-y-6">
            <p className="text-xs font-bold tracking-widest text-gray-400 uppercase">
              Indikasi Risiko Tertinggi
            </p>
            {loading ? (
              <div className="text-gray-400 text-xs animate-pulse">Memuat data...</div>
            ) : highRiskLocs.length > 0 ? (
              highRiskLocs.map((loc) => (
                <div key={loc.daerah}>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="font-semibold">{loc.daerah}</span>
                    <span className="font-bold" style={{ color: getRiskColor(loc.index_resiko) }}>
                      {Number(loc.index_resiko).toFixed(0)}%
                    </span>
                  </div>
                  
                  <div className="h-1.5 bg-gray-100 rounded-full">
                    <div 
                      className="h-1.5 rounded-full transition-all duration-1000" 
                      style={{ 
                        width: `${loc.index_resiko}%`, 
                        backgroundColor: getRiskColor(loc.index_resiko) // 3. Dynamically set background color
                      }} 
                    />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-gray-400 italic">Data belum tersedia.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default RiskPublicMapSection;