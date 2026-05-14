import { useEffect, useState } from "react";

import axios from "axios";

import Navbar from "../ui/Navbar";
import HeroHome from "../ui/HeroHome";

import ChallengeSection from "../sections/ChallengeSection";
import RiskPublicMapSection from "../sections/RiskPublicMapSection";
import MissionSection from "../sections/MissionSection";

import FinalCTA from "../ui/FinalCTA";

import { Eye, History, BarChart3, Gavel, AlertOctagon } from "lucide-react";

const challenges = [
  {
    icon: <History className="w-4 h-4 text-red-700" />,
    bgColor: "bg-red-50",
    title: "Pengawasan Lambat & Reaktif",
    desc: "BPK/KPK biasanya bertindak setelah kerugian terjadi.",
  },

  {
    icon: <BarChart3 className="w-4 h-4 text-slate-700" />,
    bgColor: "bg-slate-100",
    title: "Data Kompleks & Masif",
    desc: "Audit manual sulit menemukan pola korupsi tersembunyi.",
  },

  {
    icon: <Gavel className="w-4 h-4 text-amber-700" />,
    bgColor: "bg-amber-50",
    title: "Kerawanan Sektor Strategis",
    desc: "Tender dan infrastruktur rawan manipulasi.",
  },

  {
    icon: <AlertOctagon className="w-4 h-4 text-red-700" />,
    bgColor: "bg-red-50",
    title: "Deteksi Anomali Kaku",
    desc: "Sistem lama tidak adaptif terhadap modus baru.",
  },

  {
    icon: <Eye className="w-4 h-4 text-slate-700" />,
    bgColor: "bg-slate-100",
    title: "Explainability",
    desc: "AI harus tetap dapat dijelaskan auditor manusia.",
  },
];

export default function HomePage() {
  const [riskData, setRiskData] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRiskMap = async () => {
      try {
        setLoading(true);

        const response = await axios.get(
          "http://localhost:8005/api/v1/riskMap/",
        );

        setRiskData(response.data.data);

      } catch (err) {
        console.log(err);

        setError("Failed to fetch risk map");
      } finally {
        setLoading(false);
      }
    };

    fetchRiskMap();
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans">
      <Navbar />

      <HeroHome />

      <ChallengeSection
        challenges={challenges}
        imageUrl="https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=1200"
      />

      {/* Loading */}
      {loading && <div className="text-center py-10">Loading risk map...</div>}

      {/* Error */}
      {error && <div className="text-center text-red-500 py-10">{error}</div>}

      {/* Map */}
      {!loading && !error && <RiskPublicMapSection data={riskData} />}

      <MissionSection />

      <FinalCTA />
    </div>
  );
}
