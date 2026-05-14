import React from "react";
import { Landmark, Eye, Handshake } from "lucide-react";

const MissionSection = () => {
  const points = [
    {
      icon: <Landmark className="w-5 h-5" />,
      title: "Tujuan",
      desc: "Meningkatkan transparansi pengelolaan anggaran serta membangun kembali kepercayaan masyarakat terhadap institusi publik melalui pengawasan berbasis teknologi.",
    },
    {
      icon: <Eye className="w-5 h-5" />,
      title: "Visi",
      desc: "Mewujudkan Indonesia yang bebas korupsi melalui transparansi yang terbuka untuk seluruh masyarakat.",
    },
    {
      icon: <Handshake className="w-5 h-5" />,
      title: "Misi",
      desc: "Membangun sistem pendeteksi anggaran untuk mewujudkan transparansi pengelolaan keuangan negara.",
    },
  ];

  return (
    <section className="bg-gradient-to-b from-white to-gray-100/80 py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        
        {/* Header */}
        <div className="grid md:grid-cols-2 gap-10 items-start mb-16">
          
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#0B1C30]/50 mb-4">
              Visi & Misi
            </p>

            <h2 className="text-3xl md:text-4xl font-bold leading-tight text-[#0B1C30]">
              Membangun transparansi untuk memperkuat kepercayaan publik
            </h2>
          </div>

          <p className="text-sm md:text-base leading-relaxed text-[#0B1C30]/65 md:pt-2">
            CORTIA hadir sebagai platform pengawasan anggaran berbasis AI yang
            membantu masyarakat dan lembaga terkait dalam memantau potensi
            anomali keuangan secara lebih cepat, terbuka, dan terstruktur.
            Transparansi dan akses informasi yang jelas menjadi langkah penting
            dalam menciptakan pemerintahan yang lebih akuntabel dan terpercaya.
          </p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-5">
          {points.map((item, idx) => (
            <div
              key={idx}
              className="bg-white border border-[#0B1C30]/10 rounded-2xl p-6 shadow-sm transition-all duration-300 hover:border-[#0B1C30]/30 hover:shadow-md hover:-translate-y-1"
            >
              
              {/* Number */}
              <p className="text-sm font-medium text-[#0B1C30]/30 mb-8">
                0{idx + 1}
              </p>

              {/* Icon */}
              <div className="w-11 h-11 rounded-xl bg-[#0B1C30] flex items-center justify-center text-white mb-5">
                {item.icon}
              </div>

              {/* Content */}
              <h3 className="text-lg font-semibold text-[#0B1C30] mb-3">
                {item.title}
              </h3>

              <p className="text-sm leading-relaxed text-[#0B1C30]/65">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MissionSection;