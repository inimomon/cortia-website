import React from "react";

// import Map
import Map from "../map/Map";

const RiskMap = () => {
  return (
    <section className="w-full py-8">
      {/* 1. Changed px-60 to mx-auto with a max-width for better balance */}
      <div className="max-w-6xl mx-auto px-4">
        
        {/* Header */}
        <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <div>
                <RiskMap.Title>Peta Risiko Nasional</RiskMap.Title>
                <RiskMap.Description>
                    Distribusi risiko penyalahgunaan anggaran berdasarkan wilayah administrasi Indonesia.
                </RiskMap.Description>
            </div>

          <RiskMap.Legend>
            <RiskMap.LegendItem color="bg-green-500" label="Safe" />
            <RiskMap.LegendItem color="bg-yellow-400" label="Warning" />
            <RiskMap.LegendItem color="bg-red-500" label="Critical" />
          </RiskMap.Legend>
        </div>

        {/* Map Area */}
        <RiskMap.MapArea />

        <div className="flex justify-center mt-8">
          <RiskMap.Button>Lihat semua transaksi</RiskMap.Button>
        </div>
      </div>
    </section>
  );
};

RiskMap.Title = ({ children }) => {
  return (
    <h2 className="font-public-sans text-xl font-bold text-dark-blue">
      {children}
    </h2>
  );
};

RiskMap.Description = ({ children }) => {
  return <p className="font-inter text-sm text-gray-500 mt-1">{children}</p>;
};

RiskMap.Legend = ({ children }) => {
  return <div className="flex justify-end gap-4 mb-3">{children}</div>;
};

RiskMap.LegendItem = ({ color, label }) => {
  return (
    <span className="flex items-center gap-1.5 text-xs font-medium text-gray-700">
      <span className={`w-2.5 h-2.5 rounded-full ${color}`} />
      {label}
    </span>
  );
};

RiskMap.MapArea = () => {
  return (
    /* 2. Added a fixed height and ensured the map takes full width/height */
    <div className="relative rounded-xl bg-blue-50 border border-blue-100 h-[300px] w-full overflow-hidden shadow-inner">
      <Map />
    </div>
  );
};

RiskMap.Tooltip = ({
  region,
  riskIndex,
  riskIndexColor,
  totalAlokasi,
  kasusAktif,
}) => {
  return (
    <div className="absolute left-1/3 top-1/2 -translate-y-1/2 z-10 bg-white rounded-lg shadow-md border border-gray-100 p-3 w-44">
      <p className="font-semibold text-sm text-gray-800 mb-2">{region}</p>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-gray-500">Indeks Risiko:</span>
        <span className={`font-bold ${riskIndexColor}`}>{riskIndex}</span>
      </div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-gray-500">Total Alokasi:</span>
        <span className="font-semibold text-gray-800">{totalAlokasi}</span>
      </div>
      <div className="flex justify-between text-xs">
        <span className="text-gray-500">Kasus Aktif:</span>
        <span className="font-semibold text-gray-800">{kasusAktif}</span>
      </div>
    </div>
  );
};

RiskMap.Button = ({ children, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="bg-gray-900 text-white text-sm font-semibold px-8 py-3 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer"
    >
      {children}
    </button>
  );
};

export default RiskMap;