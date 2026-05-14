import React, {useState, useEffect} from 'react';
import axios from 'axios';
import RiskMap from '../ui/RiskMap';
import RiskTable from '../ui/RiskTable';

const RiskMonitoringSection = ({data, selected, setSelected}) => {
  const [provinsiData, setProvinsiData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:8001/api/risk-map");
        if (response.data.success) {
          // Sort berdasarkan index_resiko tertinggi agar mirip desain
          const sortedData = response.data.data.sort((a, b) => b.index_resiko - a.index_resiko);
          setProvinsiData(sortedData);
          
          // Set default selected jika belum ada
          if (!selected && sortedData.length > 0) {
            setSelected(sortedData[0]);
          }
        }
      } catch (err) {
        console.error("Gagal mengambil data tabel:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selected, setSelected]);

  const getDotColor = (score) => {
    const s = Number(score);
    if (s >= 75) return "#ef4444"; // Red
    if (s >= 50) return "#facc15"; // Yellow/Orange (Map Threshold)
    return "#22c55e";             // Green
  };

  const getSkorColor = (score) => {
    const s = Number(score);
    if (s >= 75) return "#ef4444";
    if (s >= 50) return "#facc15"; 
    return "#22c55e"; 
  };

  if (loading) return <div className="p-10 text-center">Memuat Data Monitoring...</div>;

  return (
    <section className="grid md:grid-cols-2 gap-6 mb-10">
      {/* Map Container */}
      <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
        <h3 className="font-semibold text-gray-800 p-4 border-b border-gray-100">
          Visualisasi Geografis Anggaran
        </h3>
        <div className="h-[400px]">
          <RiskMap data={data} onProvinceClick={setSelected} />
        </div>
      </div>

      {/* Risk Table Component */}
      <RiskTable 
        data={provinsiData}
        selected={selected}
        dotColor={getDotColor}
        skorColor={getSkorColor}
      />
    </section>
  );
};

export default RiskMonitoringSection;