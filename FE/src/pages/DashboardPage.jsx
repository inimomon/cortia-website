import { useEffect, useState } from "react";
import axios from "axios";

import Navbar from "../components/ui/Navbar";
import HeroDashboard from "../components/ui/HeroDashboard";
import AggregateSummary from "../components/cards/AgregatSummary";
import StatusCard from "../components/cards/StatusCard";
import BudgetSummary from "../components/cards/BudgetSummary";
import RiskMonitoringSection from "../components/sections/RiskMonitoringSection";
import ProvinceDetail from "../components/cards/ProvinceDetail";
import RegionalBudgetCard from "../components/cards/RegionalBudgetCard";

import {
  Globe,
  ShieldAlert,
  ShieldX,
  TriangleAlert,
  CheckCircle2,
  Wallet,
  Building2,
  SearchCheck,
} from "lucide-react";

const formatCurrency = (value) => {
  const num = Number(value || 0);

  if (num >= 1_000_000_000_000) {
    return `IDR ${(num / 1_000_000_000_000).toFixed(1)}T`;
  }

  if (num >= 1_000_000_000) {
    return `IDR ${(num / 1_000_000_000).toFixed(1)}B`;
  }

  if (num >= 1_000_000) {
    return `IDR ${(num / 1_000_000).toFixed(1)}M`;
  }

  return `IDR ${num}`;
};

const skorColor = (s) => {
  if (s >= 15) return "text-red-600";
  if (s >= 7) return "text-yellow-500";
  return "text-green-600";
};

const dotColor = (status) => {
  if (status === "DANGER") return "bg-red-500";
  if (status === "WARNING") return "bg-yellow-400";
  return "bg-green-400";
};

export default function DashboardPage() {
  const [provinsiData, setProvinsiData] = useState([]);
  const [selected, setSelected] = useState(null);
  const [stats, setStats] = useState([]);
  const [statusData, setStatusData] = useState([]);
  const [budgetStats, setBudgetStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRiskMap = async () => {
      try {
        setLoading(true);

        const response = await axios.get(
          `${import.meta.env.VITE_BE_LINK}/riskMap`,
        );

        if (!response.data.success) return;

        const data = response.data.data || [];

        const mapped = data.map((item) => ({
          name: item.daerah,
          skor: Number(item.index_resiko || 0),
          anomali: Number(item.count_danger || 0),
          warning: Number(item.count_warning || 0),
          safe: Number(item.count_safe || 0),
          totalData: Number(item.total_data || 0),
          status: item.heatmap_status,
          dana: formatCurrency(item.total_alokasi),
          totalAlokasi: Number(item.total_alokasi || 0),
          totalAlokasiFinal: Number(item.total_alokasi_final || 0),
        }));

        const sorted = [...mapped].sort((a, b) => b.skor - a.skor);

        const danger = mapped.filter((item) => item.status === "DANGER");
        const warning = mapped.filter((item) => item.status === "WARNING");
        const safe = mapped.filter((item) => item.status === "SAFE");

        const totalAnggaran = mapped.reduce(
          (sum, item) => sum + item.totalAlokasi,
          0,
        );

        const totalFinal = mapped.reduce(
          (sum, item) => sum + item.totalAlokasiFinal,
          0,
        );

        const totalAnomali = mapped.reduce(
          (sum, item) => sum + item.anomali,
          0,
        );

        setProvinsiData(sorted);
        setSelected(sorted[0] || null);

      setStats([
        {
          label: "PROVINSI TERANALISIS",
          val: mapped.length,
          icon: <Globe className="w-4 h-4 text-slate-900" />,
          bgColor: "bg-white",
          borderColor: "border-slate-200",
          textColor: "text-slate-950",
        },
        {
          label: "KONDISI KRITIS",
          val: danger.length,
          icon: <ShieldAlert className="w-4 h-4 text-red-600" />,
          bgColor: "bg-red-50",
          borderColor: "border-red-200",
          textColor: "text-red-600",
        },
        {
          label: "POTENSI ANOMALI",
          val: warning.length,
          icon: <TriangleAlert className="w-4 h-4 text-orange-400" />,
          bgColor: "bg-orange-50",
          borderColor: "border-orange-200",
          textColor: "text-orange-500",
        },
        {
          label: "STABIL",
          val: safe.length,
          icon: <CheckCircle2 className="w-4 h-4 text-emerald-500" />,
          bgColor: "bg-white",
          borderColor: "border-emerald-200",
          textColor: "text-emerald-600",
        },
      ]);
        setStatusData([
          {
            id: "danger",
            label: "DANGER",
            icon: ShieldX,
            colorClass: "text-red-600",
            borderColor: "border-red-100",
            primaryProvince: danger[0]?.name || "-",
            primaryVal: danger[0]?.skor?.toFixed(2) || "0",
            secondaryProvince: danger[1]?.name || "-",
            secondaryVal: danger[1]?.skor?.toFixed(2) || "0",
          },
          {
            id: "warning",
            label: "WARNING",
            icon: TriangleAlert,
            colorClass: "text-yellow-500",
            borderColor: "border-yellow-100",
            primaryProvince: warning[0]?.name || "-",
            primaryVal: warning[0]?.skor?.toFixed(2) || "0",
            secondaryProvince: warning[1]?.name || "-",
            secondaryVal: warning[1]?.skor?.toFixed(2) || "0",
          },
          {
            id: "safe",
            label: "SAFE",
            icon: CheckCircle2,
            colorClass: "text-emerald-600",
            borderColor: "border-emerald-100",
            primaryProvince: safe[0]?.name || "-",
            primaryVal: safe[0]?.skor?.toFixed(2) || "0",
            secondaryProvince: safe[1]?.name || "-",
            secondaryVal: safe[1]?.skor?.toFixed(2) || "0",
          },
        ]);

        setBudgetStats([
          {
            label: "TOTAL ANGGARAN DIAWASI",
            val: formatCurrency(totalAnggaran),
            icon: <Wallet className="w-5 h-5 text-slate-800" />,
            textColor: "text-slate-900",
          },
          {
            label: "TOTAL DATA TRANSAKSI",
            val: mapped.reduce((sum, item) => sum + item.totalData, 0),
            icon: <Building2 className="w-5 h-5 text-amber-800" />,
            textColor: "text-slate-900",
          },
          {
            label: "DATA TERINDIKASI ANOMALI",
            val: totalAnomali,
            icon: <SearchCheck className="w-5 h-5 text-red-800" />,
            textColor: "text-red-600",
          },
        ]);
      } catch (err) {
        console.error("Gagal fetch riskMap:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRiskMap();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white font-sans">
        <Navbar variant="default" />
        <div className="max-w-7xl mx-auto px-6 py-20 text-gray-400">
          Loading dashboard...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans">
      <Navbar variant="default" />

      <HeroDashboard
        title="Peta Risiko & Distribusi Anomali"
        description="Tinjauan tingkat tinggi mengenai distribusi risiko institusional dan deteksi anomali transaksi di seluruh wilayah operasional."
      />

      <div className="max-w-7xl mx-auto px-6 py-10">
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 font-serif mb-5">
            Laporan Situasi Nasional
          </h2>

          <div className="flex flex-col md:flex-row gap-6 items-stretch">
            <AggregateSummary stats={stats} />

            <div className="flex-1 border border-gray-200 rounded-xl p-5 bg-white flex flex-col">
              <p className="text-[10px] font-bold tracking-widest text-gray-400 mb-4 uppercase">
                Rincian Wilayah Prioritas
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 flex-grow">
                {statusData.map((item) => (
                  <StatusCard key={item.id} {...item} />
                ))}
              </div>
            </div>
          </div>
        </section>

        <BudgetSummary data={budgetStats} />

        <RiskMonitoringSection
          provinsiData={provinsiData}
          selected={selected}
          setSelected={setSelected}
          dotColor={dotColor}
          skorColor={skorColor}
        />

        {selected && <ProvinceDetail selected={selected} />}

        <section className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 font-serif">
              Daftar Anggaran Daerah
            </h2>

            <button className="text-sm text-teal-600 hover:text-teal-800 font-medium">
              View All Budgets
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {provinsiData.slice(0, 3).map((p) => (
              <RegionalBudgetCard
                key={p.name}
                province={p}
                skorColor={skorColor}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
