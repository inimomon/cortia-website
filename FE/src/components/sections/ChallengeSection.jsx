import React from 'react';

const ChallengeSection = ({ challenges, imageUrl }) => {
  return (
    <section className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-16 items-start">
      <div>
        {/* Subtitle with Red Accent */}
        <p className="text-[10px] uppercase tracking-widest text-red-500 font-bold mb-4 flex items-center gap-2">
          <span className="text-sm">⚠️</span> THE CHALLENGE
        </p>

        {/* Problem Statement Blockquote */}
        <blockquote className="border-l-4 border-red-500 pl-6 mb-10 py-1">
          <p className="text-gray-800 font-semibold text-lg leading-relaxed font-serif italic">
            "Belum optimalnya sistem pengawasan pengelolaan keuangan negara dalam mendeteksi dan mencegah penggelapan dana secara dini akibat keterbatasan pendekatan konvensional."
          </p>
        </blockquote>

        {/* Challenge List Mapping */}
        <div className="space-y-6">
          {challenges.map((c, index) => (
            <div key={index} className="flex gap-4 group">
              <div className={`shrink-0 w-12 h-12 ${c.bgColor} rounded-xl flex items-center justify-center transition-transform group-hover:scale-110`}>
                {c.icon}
              </div>
              <div>
                <p className="font-bold text-gray-900 text-sm">{c.title}</p>
                <p className="text-xs text-gray-500 leading-relaxed mt-1 max-w-sm">
                  {c.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Visual Side: The Image */}
      <div className="relative rounded-2xl overflow-hidden shadow-2xl group h-full min-h-[400px]">
        {/* Subtle Overlay to make it feel more "Institutional" */}
        <div className="absolute inset-0 bg-gray-900/10 group-hover:bg-transparent transition-colors z-10" />
        <img
          src={imageUrl || "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=1200"} 
          alt="Audit and Finance Analysis"
          className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-500"
        />
      </div>
    </section>
  );
};

export default ChallengeSection;