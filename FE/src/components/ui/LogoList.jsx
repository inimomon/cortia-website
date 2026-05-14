import React from "react";

import AiConnectHitam from "../../assets/AiConnectHitam.png";
import DTETI from "../../assets/DTETI.png";
import FINDIT from "../../assets/FINDIT.png";
import opentender from "../../assets/opentender.png";
import ugm from "../../assets/ugm.png";

const logos = [
  {
    image: opentender,
    className: "scale-110 md:scale-125",
  },
  {
    image: AiConnectHitam,
    className: "scale-150 md:scale-[1.9]",
  },
  {
    image: ugm,
    className: "scale-100",
  },
  {
    image: DTETI,
    className: "scale-100",
  },
  {
    image: FINDIT,
    className: "scale-100",
  },
];

const LogoList = () => {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-8 md:gap-x-14 lg:gap-x-20">
      
      {logos.map((logo, index) => (
        <div
          key={index}
          className="w-[90px] h-[45px] md:w-[120px] md:h-[60px] flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300"
        >
          <img
            src={logo.image}
            alt="Partner Logo"
            className={`max-w-full max-h-full object-contain transition-transform duration-300 ${logo.className}`}
          />
        </div>
      ))}
    </div>
  );
};

export default LogoList;