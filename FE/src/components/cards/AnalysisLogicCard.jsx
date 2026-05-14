import React from 'react';

const AnalysisLogicCard = ({ 
  transactionId = "TX-99021", 
  status = "CRITICAL ANOMALY",
  metrics = [],
  insight = "" 
}) => {
  return (
    <div className="border border-gray-200 rounded-xl p-6 shadow-sm bg-white h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">
            Status Analisis
          </p>
          <p className="font-bold text-gray-900">Logic Analysis: {transactionId}</p>
        </div>
        <span className="bg-red-100 text-red-700 text-[10px] font-black px-2 py-1 rounded tracking-tighter italic">
          {status}
        </span>
      </div>

      {/* Metrics List */}
      <div className="space-y-5 flex-grow">
        {metrics.map((m) => (
          <div key={m.label}>
            <div className="flex justify-between text-[11px] text-gray-500 mb-1.5">
              <span className="font-medium">{m.label}</span>
              <span className="font-bold text-gray-800 uppercase">{m.value}</span>
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full ${m.color} transition-all duration-1000`} 
                style={{ width: m.width }} 
              />
            </div>
          </div>
        ))}
      </div>

      {/* AI Insight Box */}
      {insight && (
        <div className="mt-6 relative">
          <div className="absolute -top-2 left-3 bg-white px-2 text-[9px] font-bold text-gray-400 uppercase tracking-tighter">
            AI Insight
          </div>
          <p className="text-xs text-gray-600 leading-relaxed italic bg-slate-50 p-4 rounded-lg border border-slate-100">
            "{insight}"
          </p>
        </div>
      )}
    </div>
  );
};

export default AnalysisLogicCard;