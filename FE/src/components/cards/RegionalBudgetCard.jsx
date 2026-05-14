import React from "react";
import { Landmark } from "lucide-react";

const RegionalBudgetCard = ({ province, skorColor }) => {
  const statusConfig = {
    kritis: {
      label: "KRITIS",
      bg: "bg-red-50",
      text: "text-red-700",
      border: "border-red-500",
      dot: "bg-red-500",
    },
    anomali: {
      label: "ANOMALI",
      bg: "bg-yellow-50",
      text: "text-yellow-700",
      border: "border-yellow-500",
      dot: "bg-yellow-500",
    },
    stabil: {
      label: "STABIL",
      bg: "bg-green-50",
      text: "text-green-700",
      border: "border-green-500",
      dot: "bg-green-500",
    },
  };

  const getStatusKey = (value) => {
    const status = String(value || "").toLowerCase();

    if (status === "kritis" || status === "danger" || status === "high") {
      return "kritis";
    }

    if (status === "anomali" || status === "warning" || status === "medium") {
      return "anomali";
    }

    return "stabil";
  };

  const status = statusConfig[getStatusKey(province.status)];
  return (
    <div className="group bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
      <div className="flex items-start justify-between gap-4 mb-5">
        <div>
          <p className="text-[10px] text-slate-400 uppercase tracking-[0.22em] font-bold mb-2">
            Informasi Anggaran
          </p>

          <h3 className="text-xl font-bold text-[#0B1C30] leading-tight">
            {province.name}
          </h3>
        </div>

        <div
          className={`w-11 h-11 rounded-xl bg-slate-50 flex items-center justify-center ${skorColor(
            province.skor
          )}`}
        >
        </div>
      </div>

      <div className={`border-t-2 ${status.border} mb-5`} />

      <div className="space-y-4">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">
            Alokasi Dana
          </p>

          <p className="text-lg font-bold text-[#0B1C30]">
            {province.dana}
          </p>
        </div>

        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">
              Skor Risiko
            </p>

            <p className={`text-2xl font-bold ${skorColor(province.skor)}`}>
              {province.skor}
            </p>
          </div>

          <span
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold ${status.bg} ${status.text}`}
          >
            <span className={`w-2 h-2 rounded-full ${status.dot}`} />
            {status.label}
          </span>
        </div>
      </div>
    </div>
  );
};

export default RegionalBudgetCard;