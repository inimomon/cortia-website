import React from "react";
import { Link } from "react-router-dom";
import heroHome from "../../assets/homeHero.png";

const HeroHome = () => {
  return (
    <section className="pt-8 md:pt-14">
      <div className="relative min-h-[500px] md:min-h-[800px] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <img
          src={heroHome}
          alt="CORTIA Hero Background"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Main Content */}
        <div className="relative z-10 text-center px-4 md:px-6 py-12 md:py-20 max-w-3xl mx-auto">
          {/* Heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-[#0B1C30] leading-tight mb-6 font-serif">
            Deteksi Korupsi
            <br />
            <span className="italic text-[#3A3F44]">Sebelum Terjadi</span>
          </h1>

          {/* Description */}
          <p className="text-[#45464D] max-w-xl mx-auto mb-8 md:mb-10 text-sm md:text-base leading-relaxed">
            CORTIA merupakan platform berbasis AI yang membantu mendeteksi
            potensi penyimpangan dana negara untuk menciptakan transparansi dan
            pengawasan yang lebih efektif.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/feature"
              className="inline-flex items-center justify-center bg-[#0B1C30] text-white text-sm font-semibold px-7 py-3.5 rounded-xl hover:opacity-90 transition-all duration-300 shadow-lg"
            >
              Pelajari lebih lanjut
            </Link>

            <button className="text-black text-sm font-medium hover:underline">
              Lihat Transparansi
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroHome;
