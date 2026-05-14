import React from "react";

import LogoList from "./LogoList";

const Footer = () => {
  return (
    <footer className="bg-[#F8F8F8] py-8 flex justify-center">
      <div className="w-full max-w-7xl px-6">

        {/* Top Section */}
        <div className="flex flex-col md:flex-row justify-between gap-10 pb-8 border-gray-300">

          {/* Logo + Description */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              {/* Logo */}
              <div className="w-12 h-12 rounded-full border-2 border-[#0E2A47] flex items-center justify-center">
                <span className="text-[#0E2A47] font-bold text-xl">
                  C
                </span>
              </div>

              <h2 className="text-[#0E2A47] font-bold text-2xl">
                CORTIA
              </h2>
            </div>

            <p className="text-gray-600 text-sm leading-relaxed max-w-sm">
              Lorem ipsum dolor sit amet consectetur adipiscing elit
              Ut et massa mi. Aliquam in hendrerit.
            </p>
          </div>

          {/* Right Navigation */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 text-sm">

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
                <li>[Icon Email] : contact@gmail.com</li>
                <li>[Icon Kontak] : +62 8123 456 789</li>
              </ul>
            </div>

          </div>
        </div>

        {/* List of logo (Dynamic Injection) */}
        <div className="w-full border-b border-gray-300 flex justify-end gap-12 py-6">
            <LogoList />
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