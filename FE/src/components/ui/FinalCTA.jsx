import React from 'react';
import { Lock, Scale } from 'lucide-react';

const FinalCTA = ({ showPillars = false }) => {
  return (
    <section className="border-t border-gray-100 py-24 text-center px-6 bg-white">
      {/* Decorative horizontal line separator */}
      <div className="w-8 h-px bg-gray-400 mx-auto mb-8" />
      
      <h2 className="text-4xl font-bold text-gray-900 font-serif mb-4 leading-tight">
        Menjaga Setiap Rupiah,<br />
        <span className="italic font-light">Membangun Kepercayaan.</span>
      </h2>
      
      <p className="text-gray-500 text-sm max-w-xl mx-auto mb-12 leading-relaxed">
        Keuangan negara adalah amanah rakyat. Integritas keuangan adalah napas dari demokrasi yang sehat. 
        CORTIA memastikan akuntabilitas bukan sekadar slogan, melainkan realitas dalam setiap alokasi anggaran.
      </p>

      {showPillars && (
        <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto text-left mt-16 border-t border-gray-50 pt-12">
          {/* Transparency Pillar */}
          <div className="flex gap-4">
            <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center shrink-0">
               <Lock className="w-4 h-4 text-slate-400" />
            </div>
            <div>
              <p className="font-semibold text-sm text-gray-800">Transparansi Mutlak</p>
              <p className="text-xs text-gray-500 leading-relaxed mt-1">
                Akses publik terhadap informasi keuangan adalah hak dasar dalam negara hukum yang berdaulat.
              </p>
            </div>
          </div>

          {/* Justice Pillar */}
          <div className="flex gap-4">
             <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center shrink-0">
               <Scale className="w-4 h-4 text-slate-400" />
            </div>
            <div>
              <p className="font-semibold text-sm text-gray-800">Keadilan Fiskal</p>
              <p className="text-xs text-gray-500 leading-relaxed mt-1">
                Memastikan alokasi sumber daya dilakukan secara merata tanpa ada pihak yang dirugikan oleh praktik koruptif.
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default FinalCTA;