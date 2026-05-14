import React from 'react';
import { Landmark } from 'lucide-react';

const RegionalBudgetCard = ({ province, skorColor }) => {
  // Mapping statuses to the specific labels in your screenshot
  const statusLabels = {
    kritis: 'HIGH',
    anomali: 'MODERATE',
    stabil: 'LOW'
  };

  return (
    <div className="border border-gray-200 rounded p-5 bg-white hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-[9px] text-gray-500 uppercase tracking-widest font-bold mb-1">
            Informasi Anggaran
          </p>
          <h3 className="text-xl font-bold text-slate-800">{province.name}</h3>
        </div>
        {/* Color-coded Landmark icon based on score */}
        <span className={`${skorColor(province.skor)} opacity-80`}>
          <Landmark className="w-5 h-5" />
        </span>
      </div>

      <div className="space-y-1.5 border-t border-gray-100 pt-4">
        <div className="flex justify-between text-[11px]">
          <span className="text-gray-500">Alokasi Dana:</span>
          <span className="font-bold text-slate-700">{province.dana}</span>
        </div>

        <div className="flex justify-between text-[11px] items-center">
          <span className="text-gray-500">Skor Anomali:</span>
          <div className="flex items-center gap-1.5">
            <span className={`font-bold ${skorColor(province.skor)}`}>
              {province.skor}
            </span>
            {/* The Badge logic */}
            <span 
              className={`
                text-[8px] font-black px-1 py-0.5 rounded-sm 
                ${province.status === 'kritis' ? 'bg-red-100 text-red-700' : 
                  province.status === 'anomali' ? 'bg-orange-100 text-orange-700' : 
                  'bg-blue-100 text-blue-700'}
              `}
            >
              {statusLabels[province.status] || province.status.toUpperCase()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegionalBudgetCard;