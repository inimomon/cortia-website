import { Link } from 'react-router-dom';
import Navbar from '../components/ui/Navbar';
import HeroHome from '../components/ui/HeroHome';
import DynamicInjection from '../components/ui/DynamicInjection';
import ChallengeSection from '../components/sections/ChallengeSection';
import RiskPublicMapSection from '../components/sections/RiskPublicMapSection';
import MissionSection from '../components/sections/MissionSection';
import FinalCTA from '../components/ui/FinalCTA';
import Footer from '../components/ui/Footer';

import { Landmark, Eye, Handshake, History, BarChart3, Gavel, AlertOctagon } from 'lucide-react';


const challenges = [
  {
    icon: <History className="w-4 h-4 text-red-700" />,
    bgColor: "bg-red-50",
    title: 'Pengawasan Lambat & Reaktif',
    desc: 'BPK/KPK biasanya bertindak setelah kerugian terjadi. Belum ada sistem yang mampu memberi early warning sebelum dana cair.',
  },
  {
    icon: <BarChart3 className="w-4 h-4 text-slate-700" />,
    bgColor: "bg-slate-100",
    title: 'Data Kompleks & Masif',
    desc: 'Transaksi lintas daerah yang sangat banyak membuat audit manual sulit menemukan pola korupsi tersembunyi.',
  },
  {
    icon: <Gavel className="w-4 h-4 text-amber-700" />,
    bgColor: "bg-amber-50",
    title: 'Kerawanan Sektor Strategis',
    desc: 'Pengadaan dan infrastruktur rawan manipulasi seperti mark-up harga, tender setting, dan kolusi perusahaan boneka.',
  },
  {
    icon: <AlertOctagon className="w-4 h-4 text-red-700" />,
    bgColor: "bg-red-50",
    title: 'Deteksi Anomali Kaku',
    desc: 'Sistem existing hanya berbasis rule/manual checking dan tidak adaptif terhadap modus operandi baru yang makin canggih.',
  },
  {
    icon: <Eye className="w-4 h-4 text-slate-700" />,
    bgColor: "bg-slate-100",
    title: 'Transparansi & Explainability',
    desc: 'Sistem AI sering dianggap black-box. Dibutuhkan sistem yang hasilnya akurat namun tetap dapat dijelaskan ke auditor manusia.',
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white font-sans">
      <Navbar variant="default" />

      {/* Hero */}
      <HeroHome />

      {/* Dynamic Injection */}
      <DynamicInjection />

      {/* The Challenge */}
      <ChallengeSection 
        challenges={challenges} 
        imageUrl="https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=1200" 
      />

      {/* Map + Sidebar info*/}
      <RiskPublicMapSection />

      {/* Tujuan / Visi / Misi cards */}
      <MissionSection />

      {/* CTA */}
      <FinalCTA />

      {/* Footer */}
      <Footer />
    </div>
  );
}