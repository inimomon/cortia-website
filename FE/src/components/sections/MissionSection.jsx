import React from 'react';
import { Landmark, Eye, Handshake } from 'lucide-react';

const MissionSection = () => {
  const points = [
    {
      icon: <Landmark className="w-5 h-5 text-slate-800" />,
      title: 'Tujuan',
      desc: 'Menjadi garda terdepan dalam menjaga kesehatan fiskal negara.'
    },
    {
      icon: <Eye className="w-5 h-5 text-slate-800" />,
      title: 'Visi',
      desc: 'Mewujudkan Indonesia yang bebas korupsi melalui transparansi radikal.'
    },
    {
      icon: <Handshake className="w-5 h-5 text-slate-800" />,
      title: 'Misi',
      desc: 'Memperkuat sinergi antara lembaga pengawas, pemerintah, dan publik.'
    }
  ];

  return (
    <section className="max-w-7xl mx-auto px-6 py-20">
      {/* Header Grid */}
      <div className="grid md:grid-cols-2 gap-12 items-start mb-16">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
            Visi & Misi
          </p>
          <h2 className="text-3xl font-bold text-gray-900 font-serif leading-tight">
            Membangun fondasi moral<br />melalui teknologi pengawasan
          </h2>
        </div>
        <p className="text-gray-500 text-sm leading-relaxed md:mt-6">
          CORTIA hadir untuk menciptakan ekosistem keuangan yang bersih dan adil. Kami percaya bahwa integritas fiskal adalah kunci utama menuju kedaulatan ekonomi yang berkelanjutan.
        </p>
      </div>

      {/* Icon Cards Grid */}
      <div className="grid md:grid-cols-3 gap-8">
        {points.map((item, idx) => (
          <div key={idx} className="group">
            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-teal-50 transition-colors">
              {item.icon}
            </div>
            <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              {item.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default MissionSection;