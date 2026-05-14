import React from "react";
import heroDashboard from "../../assets/heroDashboard.png";

const HeroAudit = ({
  title = "",
  description = "",
}) => {
  return (
    <section className="relative w-full h-[320px] sm:h-[400px] md:h-[500px] px-4 sm:px-6 md:px-10 pt-4 md:pt-6 overflow-hidden mt-10 md:mt-12">
      <div className="relative max-w-7xl mx-auto h-full rounded-3xl overflow-hidden">
        
        {/* Background Image */}
        <img
          src={heroDashboard}
          alt="Hero Feature"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/50" />

        {/* Content */}
        <div className="relative z-10 h-full flex items-center px-5 sm:px-8 md:px-16">
          <div className="max-w-2xl">
            <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-3 md:mb-4 font-serif leading-snug md:leading-tight text-white">
              {title}
            </h1>

            <p className="text-xs sm:text-sm md:text-base leading-relaxed text-gray-200 max-w-lg">
              {description}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroAudit;