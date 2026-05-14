import { useState } from 'react';
import Navbar from '../components/ui/Navbar';
import RiskMap from '../components/ui/RiskMap';
import HeroDashboard from '../components/ui/HeroDashboard';
import AggregateSummary from '../components/cards/AgregatSummary';
import StatusCard from '../components/cards/StatusCard';
import BudgetSummary from '../components/cards/BudgetSummary';
import RiskMonitoringSection from '../components/sections/RiskMonitoringSection';
import ProvinceDetail from '../components/cards/ProvinceDetail';
import RegionalBudgetCard from '../components/cards/RegionalBudgetCard';
import { Globe, ShieldAlert, ShieldX, TriangleAlert, CheckCircle2, Wallet, Building2, SearchCheck, Landmark } from 'lucide-react';

const provinsiData = [
  { name: 'DKI Jakarta', skor: 89.4, anomali: 1240, status: 'kritis', dana: 'IDR 82.5T' },
  { name: 'Jawa Barat', skor: 76.2, anomali: 892, status: 'anomali', dana: 'IDR 45.2T' },
  { name: 'Sumatera Utara', skor: 68.1, anomali: 540, status: 'anomali', dana: 'IDR 28T' },
  { name: 'Jawa Timur', skor: 45.1, anomali: 310, status: 'normal', dana: 'IDR 38.7T' },
  { name: 'Kalimantan Timur', skor: 42.0, anomali: 285, status: 'normal', dana: 'IDR 22T' },
  { name: 'Sulawesi Selatan', skor: 18.4, anomali: 82, status: 'stabil', dana: 'IDR 18T' },
  { name: 'Papua', skor: 15.2, anomali: 64, status: 'stabil', dana: 'IDR 12T' },
];

const skorColor = (s) => {
  if (s >= 70) return 'text-red-600';
  if (s >= 40) return 'text-orange-500';
  return 'text-green-600';
};

const dotColor = (s) => {
  if (s === 'kritis') return 'bg-red-500';
  if (s === 'anomali') return 'bg-orange-400';
  return 'bg-green-400';
};

const statusData = [
  {
    id: 'kritis',
    label: 'KRITIS',
    icon: ShieldX,
    colorClass: 'text-red-600',
    borderColor: 'border-red-100',
    primaryProvince: 'DKI Jakarta',
    primaryVal: '89.4',
    secondaryProvince: 'Jawa Barat',
    secondaryVal: '76.2'
  },
  {
    id: 'anomali',
    label: 'ANOMALI',
    icon: TriangleAlert,
    colorClass: 'text-orange-500',
    borderColor: 'border-orange-100',
    primaryProvince: 'DKI Jakarta',
    primaryVal: '1,240',
    secondaryProvince: 'Jawa Barat',
    secondaryVal: '892'
  },
  {
    id: 'stabil',
    label: 'STABIL',
    icon: CheckCircle2,
    colorClass: 'text-emerald-600',
    borderColor: 'border-emerald-100',
    primaryProvince: 'DI Yogyakarta',
    primaryVal: '8.2',
    secondaryProvince: 'Bali',
    secondaryVal: '12.5'
  }
];

const stats = [
  {
    label: 'PROVINSI TERANALISIS',
    val: '34',
    icon: <Globe className="w-4 h-4 text-slate-800" />,
    bgColor: "bg-slate-100",
    borderColor: "border-gray-200",
    textColor: "text-slate-900"
  },
  {
    label: 'KONDISI KRITIS',
    val: '4',
    icon: <ShieldAlert className="w-4 h-4 text-red-700" />,
    bgColor: "bg-red-50",
    borderColor: "border-red-100",
    textColor: "text-red-700"
  },
  {
    label: 'POTENSI ANOMALI',
    val: '12',
    icon: <TriangleAlert className="w-4 h-4 text-orange-600" />,
    bgColor: "bg-orange-50",
    borderColor: "border-orange-100",
    textColor: "text-orange-600"
  },
  {
    label: 'STABIL',
    val: '18',
    icon: <CheckCircle2 className="w-4 h-4 text-emerald-700" />,
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-100",
    textColor: "text-emerald-700"
  }
];

const budgetStats = [
  {
    label: 'TOTAL ANGGARAN DIAWASI',
    val: 'IDR 45.2T',
    icon: <Wallet className="w-5 h-5 text-slate-800" />,
    textColor: 'text-slate-900'
  },
  {
    label: 'PROYEK / INSTANSI AKTIF',
    val: '1,204',
    icon: <Building2 className="w-5 h-5 text-amber-800" />,
    textColor: 'text-slate-900'
  },
  {
    label: 'DANA TERDETEKSI ANOMALI',
    val: 'IDR 2.1T',
    icon: <SearchCheck className="w-5 h-5 text-red-800" />,
    textColor: 'text-red-600'
  }
];

export default function DashboardPage() {
  const [selected, setSelected] = useState(provinsiData[0]);

  return (
    <div className="min-h-screen bg-white font-sans">
      <Navbar variant="default" />

      {/* Hero */}
      <HeroDashboard 
        title="Peta Risiko & Distribusi Anomali"
        description="Tinjauan tingkat tinggi mengenai distribusi risiko institusional dan deteksi anomali transaksi di seluruh wilayah operasional."
      />

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Laporan Situasi Nasional */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 font-serif mb-5">Laporan Situasi Nasional</h2>
          
          <div className="flex flex-col md:flex-row gap-6 items-stretch">
            
            {/* Ringkasan Agregat */}
            <AggregateSummary stats={stats} />
            {/* <AggregateSummary /> */}

            {/* Rincian Wilayah */}
            <div className="flex-1 border border-gray-200 rounded-xl p-5 bg-white flex flex-col">
              <p className="text-[10px] font-bold tracking-widest text-gray-400 mb-4 uppercase">
                Rincian Wilayah Prioritas
              </p>
              
              {/* flex-grow here ensures this grid also pushes to the bottom */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 flex-grow">
                {statusData.map((item) => (
                  <StatusCard key={item.id} {...item} />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Ringkasan Anggaran */}
        <BudgetSummary data={budgetStats} />
        {/* <BudgetSummary /> */}

        {/* Map + Risk Table */}
        <RiskMonitoringSection 
          provinsiData={provinsiData}
          selected={selected}
          setSelected={setSelected}
          dotColor={dotColor}
          skorColor={skorColor}
        />
        {/* <RiskMonitoringSection /> */}

        {/* Detail Selected Province */}
        <ProvinceDetail selected={selected} />
        {/* <ProvinceDetail /> */}

        {/* Daftar Anggaran Daerah cards */}
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