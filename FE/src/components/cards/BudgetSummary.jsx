import React from 'react';

const BudgetSummary = ({ data }) => {
  return (
    <section className="grid md:grid-cols-3 gap-4 border border-gray-100 rounded-xl p-5 bg-white shadow-sm mb-10">
      {data.map((s, idx) => (
        <div 
          key={idx} 
          className="flex items-center gap-4 p-4 border-r last:border-r-0 border-gray-100"
        >
          <div className="shrink-0">
            {s.icon}
          </div>
          <div>
            <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-1">
              {s.label}
            </p>
            <p className={`text-2xl font-bold ${s.textColor}`}>
              {s.val}
            </p>
          </div>
        </div>
      ))}
    </section>
  );
};

export default BudgetSummary;