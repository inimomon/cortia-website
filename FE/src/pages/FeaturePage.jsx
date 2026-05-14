import Navbar from "../components/ui/Navbar";
import Footer from "../components/ui/Footer";
import HeroFeature from "../components/ui/HeroFeature";
import AnalysisLogicCard from "../components/cards/AnalysisLogicCard";
import {
  Eye,
  FileBarChart2,
  Check,
  ShieldAlert,
  MapPinned,
  Users,
  ChartColumn,
} from "lucide-react";
import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const exampleMetrics = [
  {
    label: "Keterkaitan vendor",
    value: "92% Match",
    color: "bg-red-500",
    width: "92%",
  },
  {
    label: "Anomali Harga Satuan",
    value: "74% Variance",
    color: "bg-blue-500",
    width: "74%",
  },
  {
    label: "Kecepatan Pencairan",
    value: "98% Velocity",
    color: "bg-red-600",
    width: "98%",
  },
];

const dashboardFeatures = [
  {
    icon: <ChartColumn className="w-5 h-5 text-blue-700" />,
    bgColor: "bg-blue-100",
    title: "Visualisasi Data Interaktif",
    desc: "Data ditampilkan dalam bentuk grafik, heatmap, dan statistik agar lebih mudah dianalisis.",
  },
  {
    icon: <MapPinned className="w-5 h-5 text-blue-700" />,
    bgColor: "bg-blue-100",
    title: "Pemetaan Potensi Penyalahgunaan Anggaran",
    desc: "Menampilkan tingkat risiko setiap provinsi berdasarkan hasil analisis oleh AI.",
  },
  {
    icon: <Users className="w-5 h-5 text-blue-700" />,
    bgColor: "bg-blue-100",
    title: "Akses Bebas Untuk Umum",
    desc: "Memantau aktivitas pengadaan dan potensi penyalahgunaan secara langsung.",
  },
  {
    icon: <ShieldAlert className="w-5 h-5 text-red-700" />,
    bgColor: "bg-red-100",
    title: "Indikator Risiko",
    titleColor: "text-red-600",
    desc: "Memberikan indikator risiko rendah, sedang, dan tinggi pada setiap data pengadaan.",
  },
];

export default function FeaturePage() {
  const heroRef = useRef(null);
  const feature1Ref = useRef(null);
  const feature2Ref = useRef(null);
  const feature3Ref = useRef(null);

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

      // Feature 1 animation
      gsap.from(feature1Ref.current, {
        opacity: 0,
        y: 40,
        duration: 1,
        delay: 0.2,
        scrollTrigger: {
          trigger: feature1Ref.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
        ease: "power3.out",
      });

      // Feature 2 animation
      gsap.from(feature2Ref.current, {
        opacity: 0,
        y: 40,
        duration: 1,
        delay: 0.2,
        scrollTrigger: {
          trigger: feature2Ref.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
        ease: "power3.out",
      });

      // Feature 3 animation
      gsap.from(feature3Ref.current, {
        opacity: 0,
        y: 40,
        duration: 1,
        delay: 0.2,
        scrollTrigger: {
          trigger: feature3Ref.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
        ease: "power3.out",
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans">
      <Navbar variant="internal" />

      {/* Hero */}
      <div ref={heroRef}>
        <HeroFeature
          title="Arsitektur & Fitur Utama"
          description="Sistem pengawasan cerdas yang menggabungkan AI Generatif dengan analisis data fiskal untuk deteksi dini penyimpangan anggaran."
        />
      </div>

      {/* Feature 1 */}
      <section
        ref={feature1Ref}
        className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-16 items-start"
      >
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4 font-serif border-l-4 border-teal-900 pl-4">
            1. Deteksi Otomatis & Penilaian Risiko
          </h2>
          <p className="text-gray-500 text-sm leading-relaxed mb-6">
            CORTIA menggunakan teknologi machine learning dengan algoritma
            Isolation Forest untuk mengenali pola transaksi dan pengadaan yang
            tidak wajar secara otomatis. Sistem mempelajari perilaku normal dari
            ribuan data tender pemerintah, lalu mendeteksi aktivitas yang
            menyimpang dari pola umum.
          </p>
          <div className="space-y-3">
            {[
              "Pemrosesan data real-time dengan latensi rendah.",
              "Analisis perilaku transaksi berbasis histori.",
            ].map((t) => (
              <div
                key={t}
                className="flex items-center gap-2 text-sm text-gray-700"
              >
                <span className="mt-0.5 text-white bg-teal-900 rounded-full p-0.75">
                  <Check size={13} />
                </span>{" "}
                {t}
              </div>
            ))}
          </div>
        </div>
        {/* Logic Analysis card */}
        <AnalysisLogicCard
          transactionId="TX-99021"
          metrics={exampleMetrics}
          insight="Pencairan dana sebesar Rp 12.4M dilakukan 12 jam setelah kontrak ditandatangani. Vendor baru terdaftar 3 hari sebelumnya."
        />
      </section>

      {/* Feature 2 */}
      <section ref={feature2Ref} className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* White-box + Audit */}
          <div className="space-y-4">
            <div className="flex flex-row gap-4">
              <div className="flex-1 border border-gray-200 rounded-xl p-6 justify-center items-center">
                <div className="text-2xl mb-2 flex justify-center text-teal-900">
                  <Eye />
                </div>
                <p className="font-semibold text-gray-900 text-sm mb-2 text-center">
                  White-Box Model
                </p>
                <p className="text-xs text-gray-500 mt-1 text-center">
                  Logika keputusan yang dapat ditelusuri dan diaudit.
                </p>
              </div>
              <div className="flex-1 border border-gray-200 rounded-xl p-6 justify-center items-center">
                <div className="text-2xl mb-2 flex justify-center text-teal-900">
                  <FileBarChart2 />
                </div>
                <p className="font-semibold text-gray-900 text-sm mb-2 text-center">
                  Audit Trails
                </p>
                <p className="text-xs text-gray-500 mt-1 text-center">
                  Log otomatis untuk setiap variabel.
                </p>
              </div>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="md:pl-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 font-serif border-l-4 border-gray-900 pl-4">
              2. Explainable AI: Transparansi Logika
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed">
              CORTIA tidak hanya memberikan skor risiko, tetapi juga menjelaskan
              alasan di balik keputusan sistem menggunakan teknologi Explainable
              AI berbasis SHAP. Setiap hasil analisis akan menampilkan
              faktor-faktor utama yang menyebabkan suatu proyek dianggap
              berisiko sehingga auditor dan pengambil kebijakan dapat memahami
              hasil prediksi secara jelas.
            </p>
          </div>
        </div>
      </section>

      {/* Feature 3 */}
      <section ref={feature3Ref} className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-4 mb-3">
            <div className="w-16 h-px bg-red-300" />
            <h2 className="text-2xl font-bold text-gray-900 font-serif">
              3. Dashboard Pemantauan Risiko 
            </h2>
            <div className="w-16 h-px bg-red-300" />
          </div>
          <p className="text-gray-500 text-sm max-w-lg mx-auto mb-12 leading-relaxed">
            CORTIA menyediakan dashboard interaktif untuk memantau kondisi
            pengadaan dan risiko anggaran secara langsung dari berbagai daerah
            di Indonesia. Dashboard ini membantu pemerintah dan lembaga
            pengawasan mengambil keputusan lebih cepat berdasarkan data aktual.
          </p>
          <div className="grid md:grid-cols-4 gap-6">
            {dashboardFeatures.map((step, idx) => (
              <div
                key={idx}
                className="flex-1 flex flex-col items-center text-center px-4"
              >
                <div
                  className={`w-14 h-14 ${step.bgColor} rounded-full flex items-center justify-center mb-6`}
                >
                  {step.icon}
                </div>
                <h3
                  className={`font-bold text-sm mb-2 ${step.titleColor || "text-gray-800"}`}
                >
                  {step.title}
                </h3>
                <p className="text-[11px] text-gray-500 leading-relaxed max-w-38">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
