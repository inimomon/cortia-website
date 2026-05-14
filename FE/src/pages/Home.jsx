import axios from "axios";
import { Eye, History, BarChart3, Gavel, AlertOctagon } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "../components/ui/Navbar";
import HeroHome from "../components/ui/HeroHome";
import DynamicInjection from "../components/ui/DynamicInjection";
import ChallengeSection from "../components/sections/ChallengeSection";
import RiskPublicMapSection from "../components/sections/RiskPublicMapSection";
import MissionSection from "../components/sections/MissionSection";
import FinalCTA from "../components/ui/FinalCTA";
import Footer from "../components/ui/Footer";
import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

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
    desc: "Pengadaan infrastruktur rawan manipulasi seperti mark-up harga,tender setting, dan kolusi perusahaan boneka.",
  },

  {
    icon: <Eye className="w-4 h-4 text-slate-700" />,
    bgColor: "bg-slate-100",
    title: "Transparansi",
    desc: "masih kesulitan mengakses informasi anggaran secara jelas, terstruktur, dan mudah dipahami, sehingga potensi penyimpangan sering terlambat terdeteksi.",
  },
];

export default function HomePage() {
  const [riskData, setRiskData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const heroRef = useRef(null);
  const injectionRef = useRef(null);
  const challengeRef = useRef(null);
  const mapRef = useRef(null);
  const missionRef = useRef(null);
  const ctaRef = useRef(null);

  useEffect(() => {
    const fetchRiskMap = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_BE_LINK}/riskMap/`,
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

  // GSAP Animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero animation
      gsap.from(heroRef.current, {
        opacity: 0,
        y: 30,
        duration: 1,
        ease: "power3.out",
      });

      // Injection section
      gsap.from(injectionRef.current, {
        opacity: 0,
        y: 40,
        duration: 1,
        delay: 0.2,
        scrollTrigger: {
          trigger: injectionRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
        ease: "power3.out",
      });

      // Challenge section
      gsap.from(challengeRef.current, {
        opacity: 0,
        y: 50,
        duration: 1,
        delay: 0.3,
        scrollTrigger: {
          trigger: challengeRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
        ease: "power3.out",
      });

      // Map section
      gsap.from(mapRef.current, {
        opacity: 0,
        y: 50,
        duration: 1,
        delay: 0.2,
        scrollTrigger: {
          trigger: mapRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
        ease: "power3.out",
      });

      // Mission section
      gsap.from(missionRef.current, {
        opacity: 0,
        y: 50,
        duration: 1,
        delay: 0.2,
        scrollTrigger: {
          trigger: missionRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
        ease: "power3.out",
      });

      // CTA section
      gsap.from(ctaRef.current, {
        opacity: 0,
        scale: 0.95,
        duration: 1,
        delay: 0.2,
        scrollTrigger: {
          trigger: ctaRef.current,
          start: "top 85%",
          toggleActions: "play none none none",
        },
        ease: "power3.out",
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans">
      <Navbar />

      <div ref={heroRef}>
        <HeroHome />
      </div>

      {/* Dynamic Injection */}
      <div ref={injectionRef} className="py-8 md:py-12">
        <DynamicInjection />
      </div>

      {/* The Challenge */}
      <div ref={challengeRef} className="py-8 md:py-16">
        <ChallengeSection
          challenges={challenges}
          imageUrl="https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=1200"
        />
      </div>

      {/* Loading */}
      {loading && <div className="text-center py-8 md:py-10">Loading risk map...</div>}

      {/* Error */}
      {error && <div className="text-center text-red-500 py-8 md:py-10">{error}</div>}

      {/* Map */}
      {!loading && !error && (
        <div ref={mapRef} className="py-8 md:py-12">
          <RiskPublicMapSection data={riskData} />
        </div>
      )}

      {/* Mission Section */}
      <div ref={missionRef} className="py-8 md:py-16">
        <MissionSection />
      </div>

      {/* CTA Section */}
      <div ref={ctaRef} className="py-8 md:py-12">
        <FinalCTA />
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
