import React from "react";
import AiConnectHitam from "../../assets/AiConnectHitam.png";
import DTETI from "../../assets/DTETI.png";
import FINDIT from "../../assets/FINDIT.png";
import opentender from "../../assets/opentender.png";
import ugm from "../../assets/ugm.png";
import CortiaLogo from "../../assets/CortiaLogo.png";
import { Mail, Phone } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[#F8F8F8] border-t border-[#C6C6CD]">
      <div className="max-w-7xl mx-auto px-5 md:px-6 py-10 md:py-14">
        
        {/* TOP */}
        <div className="flex flex-col lg:flex-row lg:justify-between gap-12 pb-10">
          
          {/* LEFT */}
          <div className="max-w-sm">
            {/* Logo */}
            <div className="flex items-center gap-3 mb-5">
              <div className="w-11 h-11 flex-shrink-0">
                <img
                  src={CortiaLogo}
                  alt="CORTIA"
                  className="w-full h-full object-contain"
                />
              </div>

              <h2 className="text-[#0B1C30] font-bold text-2xl tracking-tight">
                CORTIA
              </h2>
            </div>

            <p className="text-sm leading-relaxed text-gray-600">
              platform berbasis AI yang mendeteksi potensi penyimpangan dana negara untuk menciptakan transparansi dan pengawasan yang lebih efektif.
            </p>
          </div>

          {/* RIGHT NAV */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-10 sm:gap-16 text-sm">
            
            {/* Platform */}
            <div>
              <h3 className="font-semibold text-[#0B1C30] uppercase mb-4 text-xs tracking-wider">
                Platform
              </h3>

              <ul className="space-y-3 text-gray-600">
                <li className="hover:text-[#0B1C30] transition cursor-pointer">
                  Home
                </li>
                <li className="hover:text-[#0B1C30] transition cursor-pointer">
                  Feature
                </li>
                <li className="hover:text-[#0B1C30] transition cursor-pointer">
                  Audit
                </li>
                <li className="hover:text-[#0B1C30] transition cursor-pointer">
                  <a href="/dashboard">Dashboard</a>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="font-semibold text-[#0B1C30] uppercase mb-4 text-xs tracking-wider">
                Legal
              </h3>

              <ul className="space-y-3 text-gray-600">
                <li className="hover:text-[#0B1C30] transition cursor-pointer">
                  Privasi
                </li>
                <li className="hover:text-[#0B1C30] transition cursor-pointer">
                  Ketentuan
                </li>
                <li className="hover:text-[#0B1C30] transition cursor-pointer">
                  Cookies
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div className="col-span-2 sm:col-span-1">
              <h3 className="font-semibold text-[#0B1C30] uppercase mb-4 text-xs tracking-wider">
                Kontak
              </h3>

              <ul className="space-y-4 text-gray-600">
                <li className="flex items-start gap-3 break-all">
                  <Mail className="size-4 mt-0.5 flex-shrink-0" />
                  <span>contact@cortia.com</span>
                </li>

                <li className="flex items-start gap-3">
                  <Phone className="size-4 mt-0.5 flex-shrink-0" />
                  <span>+62 8123 456 789</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* PARTNER LOGOS */}
        <div className="-pt-8 border-b border-gray-300">
          <div className="flex flex-wrap items-center justify-center md:justify-end gap-8 md:gap-10">
            
            <img
              src={opentender}
              alt="OpenTender"
              className="h-7 object-contain"
            />

            <img
              src={AiConnectHitam}
              alt="AI Connect"
              className="h-14 md:h-20 object-contain"
            />

            <img
              src={ugm}
              alt="UGM"
              className="h-7 object-contain"
            />

            <img
              src={DTETI}
              alt="DTETI"
              className="h-7 object-contain"
            />

            <img
              src={FINDIT}
              alt="FINDIT"
              className="h-7 object-contain"
            />
          </div>
        </div>

        {/* BOTTOM */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-sm text-gray-500 text-center sm:text-left">
            © 2026 CORTIA. All Rights Reserved.
          </p>

          <p className="text-xs text-gray-400 text-center sm:text-right">
            Built for transparency and public trust.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;