import React from "react";
import LogoList from "./LogoList";

const DynamicInjection = () => {
  return (
    <section className="w-full py-12 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6 flex flex-col items-center">
        
        {/* Title */}
        <p className="text-[11px] md:text-xs tracking-[0.25em] font-semibold text-[#0B1C30]/50 text-center uppercase">
          Data Bersumber & Berkolaborasi Dengan
        </p>

        {/* Logo Container */}
        <div className="mt-8 md:mt-12 w-full">
          <LogoList />
        </div>
      </div>
    </section>
  );
};

export default DynamicInjection;