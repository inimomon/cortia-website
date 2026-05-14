import React from 'react';

const AggregateSummary = ({ stats }) => {
  return (
    <div className="flex-1 border border-gray-200 rounded-xl p-5 bg-white flex flex-col">
      <p className="text-[10px] font-bold tracking-widest text-gray-400 mb-4 uppercase">
        Ringkasan Agregat
      </p>
      
      <div className="grid grid-cols-2 gap-3 flex-grow">
        {stats.map((s) => (
          <div 
            key={s.label} 
            className={`border ${s.borderColor} ${s.bgColor} rounded-xl p-4 shadow-sm flex flex-col justify-between`}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="bg-white/80 p-1.5 rounded-full shadow-sm shrink-0 flex items-center justify-center">
                {s.icon}
              </div>
              <p className="text-[9px] font-bold tracking-tight text-gray-500 uppercase leading-tight">
                {s.label}
              </p>
            </div>
            <p className={`text-3xl font-bold ${s.textColor}`}>
              {s.val}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AggregateSummary;