import React from 'react';

const HeroFeature = ({ 
  title = "Fitur utama CORTIA", 
  description = "Gambaran komprehensif mengenai arsitektur pengawasan institusional CORTIA." 
}) => {
  return (
    <section className="pt-14">
      <div className="relative bg-gray-900 text-white overflow-hidden">
        {/* Deep Blue Tech Gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_50%,rgba(30,60,100,0.6),transparent_60%)]" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-8 items-center">
          {/* Left Content */}
          <div>
            <h1 className="text-4xl font-bold mb-3 font-serif leading-tight">
              {title}
            </h1>
            <p className="text-gray-300 text-sm leading-relaxed max-w-sm">
              {description}
            </p>
          </div>

          {/* Right Content: Interactive Mock UI */}
          <div className="hidden md:flex gap-3 justify-end items-center">
            {/* Risk Score Card */}
            <div className="bg-gray-800/80 backdrop-blur-sm border border-gray-700 rounded-xl p-5 text-xs w-48 shadow-2xl">
              <p className="text-gray-400 font-bold tracking-widest mb-1">RISK SCORE</p>
              <div className="flex items-baseline gap-1">
                <p className="text-4xl font-black text-white">82</p>
                <span className="text-red-500 font-bold">↑</span>
              </div>
              <div className="mt-4 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-red-500 rounded-full w-[82%] animate-pulse" />
              </div>
              <p className="text-[9px] text-gray-500 mt-3 italic">Updated: Real-time</p>
            </div>

            {/* Status Column */}
            <div className="flex flex-col gap-3">
              {/* Anomaly Badge */}
              <div className="bg-red-900/30 backdrop-blur-sm border border-red-700/50 rounded-lg p-3 text-xs w-44">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
                  <p className="text-red-300 font-bold tracking-tight uppercase">Anomaly Detected</p>
                </div>
              </div>

              {/* Threat Level Badge */}
              <div className="bg-yellow-900/30 backdrop-blur-sm border border-yellow-700/50 rounded-lg p-4 text-xs w-44">
                <p className="text-yellow-200/70 font-bold tracking-widest text-[9px] mb-1 uppercase">Threat Level</p>
                <p className="text-yellow-400 text-xl font-black italic">MEDIUM</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroFeature;