import React from 'react';

const HeroAudit = () => {
  return (
    <section className="pt-14">
      <div className="relative bg-gray-900 text-white overflow-hidden">
        {/* Deep blue radial accent matching your CORTIA design system */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_50%,rgba(20,50,90,0.5),transparent_60%)]" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-14 grid md:grid-cols-2 gap-8 items-center">
          {/* Left Content */}
          <div>
            <h1 className="text-3xl font-bold mb-3 font-serif">
              Audit Mandiri & Deteksi
            </h1>
            <p className="text-gray-300 text-sm leading-relaxed max-w-sm">
              Tinjauan tingkat tinggi mengenai distribusi risiko institusional dan deteksi anomali transaksi di seluruh wilayah operasional. Data diperbarui secara real-time berdasarkan pengawasan AI.
            </p>
          </div>

          {/* Right Visual Content (Mock Data Visuals) */}
          <div className="hidden md:flex justify-end gap-3">
            {/* Bar Chart Card */}
            <div className="bg-gray-800/60 border border-gray-700 rounded-lg p-4 w-40 backdrop-blur-sm shadow-xl">
               <p className="text-[9px] text-gray-500 font-bold uppercase mb-2">Trend Analisis</p>
              <div className="h-16 bg-gray-700/50 rounded mb-2 flex items-end gap-1 px-2 pb-1">
                {[3, 5, 4, 7, 6, 8, 5].map((h, i) => (
                  <div 
                    key={i} 
                    style={{ height: `${h * 8}px` }} 
                    className="flex-1 bg-blue-400/70 rounded-sm hover:bg-blue-400 transition-colors" 
                  />
                ))}
              </div>
            </div>

            {/* Risk Matrix Card */}
            <div className="bg-gray-800/60 border border-gray-700 rounded-lg p-4 w-40 text-xs backdrop-blur-sm shadow-xl">
              <div className="text-[9px] text-gray-500 font-bold uppercase mb-2">Risk Matrix</div>
              <div className="grid grid-cols-3 gap-1">
                {[
                  'bg-red-500', 'bg-red-400', 'bg-orange-400', 
                  'bg-orange-300', 'bg-green-400', 'bg-green-300', 
                  'bg-green-200', 'bg-gray-300', 'bg-gray-200'
                ].map((c, i) => (
                  <div key={i} className={`h-4 rounded-sm ${c} opacity-80 hover:opacity-100 transition-opacity`} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroAudit;