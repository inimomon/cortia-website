import React from "react";
import {
  Brain,
  Building2,
  Clock3,
  FileSearch,
  TrendingDown,
  Zap,
} from "lucide-react";

const AIIndicatorsPreviewCard = () => {
  const indicators = [
    {
      title: "Deviasi Harga",
      desc: "Menganalisis selisih antara estimasi awal dan nilai akhir tender.",
      icon: TrendingDown,
    },
    {
      title: "Kecepatan Tender",
      desc: "Mendeteksi tender dengan proses yang terlalu cepat atau tidak normal.",
      icon: Zap,
    },
    {
      title: "Pola Vendor",
      desc: "Menganalisis vendor yang sering memenangkan proyek serupa.",
      icon: Building2,
    },
    {
      title: "Risk Score AI",
      desc: "Skor probabilitas anomali berdasarkan machine learning.",
      icon: Brain,
    },
    {
      title: "Kategori Pengadaan",
      desc: "Mengevaluasi tingkat risiko berdasarkan jenis pengadaan proyek.",
      icon: FileSearch,
    },
    {
      title: "Days To Award",
      desc: "Mengukur durasi dari publikasi tender hingga penetapan pemenang.",
      icon: Clock3,
    },
  ];

  return (
    <div className="border border-gray-200 rounded-2xl bg-white shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
        <div>
          <p className="text-[10px] text-gray-400 uppercase tracking-[0.25em] font-bold mb-1">
            Explainable AI
          </p>

          <h2 className="text-2xl font-bold text-slate-900">
            Indikator yang Digunakan AI
          </h2>
        </div>

        <div className="px-3 py-1 rounded-lg bg-slate-100 text-slate-600 text-[10px] font-black tracking-widest">
          PREVIEW
        </div>
      </div>

      {/* Body */}
      <div className="p-6">
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {indicators.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="group rounded-2xl border border-slate-200 bg-slate-50 p-5 hover:bg-slate-100 hover:border-slate-300 transition-all duration-300"
              >
                <div className="w-11 h-11 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-sm mb-4">
                  <Icon className="w-5 h-5 text-slate-700" />
                </div>

                <h3 className="text-sm font-bold text-slate-900 mb-2">
                  {item.title}
                </h3>

                <p className="text-xs text-gray-600 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-6 border-t border-gray-100 pt-5">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <p className="text-xs text-gray-600 leading-relaxed">
              Model AI melakukan evaluasi multi-indikator berbasis data
              procurement historis untuk mendeteksi pola anomali, potensi
              markup, ketidakwajaran tender, dan risiko korupsi secara lebih
              cepat serta transparan.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIIndicatorsPreviewCard;