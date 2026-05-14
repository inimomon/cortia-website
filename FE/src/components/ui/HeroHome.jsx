import React from 'react';
import { Link } from 'react-router-dom';

const HeroHome = () => {
  return (
    <section className="pt-14">
      {/* Background with soft gradients for a premium "clean" feel */}
      <div className="relative bg-gradient-to-br from-gray-50 to-gray-200 min-h-[800px] flex items-center justify-center overflow-hidden">
        
        {/* Decorative radial blur */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_60%_50%,rgba(200,210,230,0.5),transparent_70%)]" />
        
        <div className="relative z-10 text-center px-6 py-20">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-4 font-serif">
            Deteksi Korupsi
            <br />
            <span className="italic font-light">Sebelum Terjadi</span>
          </h1>
          
          <p className="text-gray-500 max-w-md mx-auto mb-8 text-sm leading-relaxed">
            Platform pengawasan keuangan negara berbasis AI yang mendeteksi anomali fiskal secara real-time, transparan, dan dapat diaudit.
          </p>
          
          <Link
            to="/feature"
            className="inline-block bg-gray-900 text-white text-sm font-medium px-8 py-3.5 rounded hover:bg-gray-700 transition-colors shadow-lg shadow-gray-200"
          >
            Pelajari lebih lanjut
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroHome;