import React from "react";
import AiConnectHitam from "../../assets/AiConnectHitam.png";
import DTETI from "../../assets/DTETI.png";
import FINDIT from "../../assets/FINDIT.png";
import opentender from "../../assets/opentender.png";
import ugm from "../../assets/ugm.png";
import LogoList from "./LogoList";
import CortiaLogo from "../../assets/CortiaLogo.png";
import { Mail, Phone } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[#F8F8F8] py-8 flex justify-center border-t-[#C6C6CD] border-t">
      <div className="w-full max-w-7xl px-6">
        {/* Top Section */}
        <div className="flex flex-col md:flex-row justify-between gap-10 pb-8 border-gray-300">
          {/* Logo + Description */}
          <div className="flex flex-col items-start">
            <div className="flex flex-col items-center">
              {/* Logo */}
              <div className="w-12 h-12">
                <img src={CortiaLogo} alt="" />
              </div>

              <h2 className="text-[#0E2A47] font-bold text-2xl">CORTIA</h2>
            </div>

            <p className="text-gray-600 text-sm leading-relaxed max-w-sm">
              Lorem ipsum dolor sit amet consectetur adipiscing elit Ut et massa
              mi. Aliquam in hendrerit.
            </p>
          </div>

          {/* Right Navigation */}
          <div className="grid grid-cols-1 sm:grid-cols-3  text-sm">
            {/* Platform */}
            <div>
              <h3 className="font-semibold text-gray-700 uppercase mb-4">
                Platform
              </h3>

              <ul className="space-y-3 text-gray-600">
                <li className="cursor-pointer hover:text-black transition">
                  Home
                </li>
                <li className="cursor-pointer hover:text-black transition">
                  Feature
                </li>
                <li className="cursor-pointer hover:text-black transition">
                  Audit
                </li>
                <li className="cursor-pointer hover:text-black transition">
                  Portal
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="font-semibold text-gray-700 uppercase mb-4">
                Legal
              </h3>

              <ul className="space-y-3 text-gray-600">
                <li className="cursor-pointer hover:text-black transition">
                  Privasi
                </li>
                <li className="cursor-pointer hover:text-black transition">
                  Ketentuan
                </li>
                <li className="cursor-pointer hover:text-black transition">
                  Cookies
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="font-semibold text-gray-700 uppercase mb-4">
                Kontak
              </h3>

              <ul className="space-y-3 text-gray-600">
                <li className="flex items-center gap-2">
                  <Mail className="size-5" />
                  contact@cortia.com
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="size-5" />
                  +62 8123 456 789
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* List of logo (Dynamic Injection) */}
        <div className="w-full border-b border-gray-300 flex justify-end items-center gap-8 py-4">
          <div className="flex items-center gap-8">
            <div className="h-8 flex items-center">
              <img
                src={opentender}
                alt="Opentender"
                className="h-full w-auto object-contain"
              />
            </div>

            <div className="h-8 flex items-center">
              <img
                src={AiConnectHitam}
                alt="AI Connect"
                className="md:h-32 h-8 w-auto object-contain"
              />
            </div>

            <div className="h-8 flex items-center">
              <img
                src={ugm}
                alt="UGM"
                className="h-full w-auto object-contain"
              />
            </div>
            <div className="h-8 flex items-center">
              <img
                src={DTETI}
                alt="DTETI"
                className="h-full w-auto object-contain"
              />
            </div>
            <div className="h-8 flex items-center">
              <img
                src={FINDIT}
                alt="FINDIT"
                className="h-full w-auto object-contain"
              />
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-6">
          <p className="text-sm text-gray-600">
            © 2026 CORTIA. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
