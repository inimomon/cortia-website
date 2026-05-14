import Navbar from '../components/ui/Navbar';
import Footer from '../components/ui/Footer';
import HeroFeature from '../components/ui/HeroFeature';
import AnalysisLogicCard from '../components/cards/AnalysisLogicCard';
import { Eye, FileBarChart2, Check, Rss, ShieldCheck, BellRing, Ban } from 'lucide-react';

const exampleMetrics = [
  { label: 'Keterkaitan vendor', value: '92% Match', color: 'bg-red-500', width: '92%' },
  { label: 'Anomali Harga Satuan', value: '74% Variance', color: 'bg-blue-500', width: '74%' },
  { label: 'Kecepatan Pencairan', value: '98% Velocity', color: 'bg-red-600', width: '98%' },
];

const ewsSteps = [
  {
    icon: <Rss className="w-5 h-5 text-blue-700" />,
    bgColor: "bg-blue-100",
    title: "Deteksi",
    desc: "Analisis pola mengidentifikasi deviasi dari baseline."
  },
  {
    icon: <ShieldCheck className="w-5 h-5 text-blue-700" />,
    bgColor: "bg-blue-100",
    title: "Verifikasi",
    desc: "XAI memvalidasi pemicu logika dalam 50ms."
  },
  {
    icon: <BellRing className="w-5 h-5 text-blue-700" />,
    bgColor: "bg-blue-100",
    title: "Notifikasi",
    desc: "Peringatan dikirim ke Node Pengawas Pusat."
  },
  {
    icon: <Ban className="w-5 h-5 text-red-700" />,
    bgColor: "bg-red-100",
    title: "Pencegahan",
    titleColor: "text-red-600",
    desc: "Dilakukan oleh KPK & pihak terkait."
  }
];

export default function FeaturePage() {
  return (
    <div className="min-h-screen bg-white font-sans">
      <Navbar variant="internal" />

      {/* Hero */}
      <HeroFeature 
        title="Arsitektur & Fitur Utama"
        description="Sistem pengawasan cerdas yang menggabungkan AI Generatif dengan analisis data fiskal untuk deteksi dini penyimpangan anggaran."
      />

      {/* Feature 1 */}
      <section className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-16 items-start">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4 font-serif border-l-4 border-teal-900 pl-4">
            1. Deteksi Otomatis & Penilaian Risiko
          </h2>
          <p className="text-gray-500 text-sm leading-relaxed mb-6">
            Modul ini menggunakan matriks pembobotan multi-dimensi untuk mengevaluasi legitimasi transaksi dalam hitungan milidetik. Setiap rekaman diuji melalui ratusan titik kepatuhan untuk menentukan skor risiko yang akurat.
          </p>
          <div className="space-y-3">
            {['Pemrosesan data real-time dengan latensi rendah.', 'Analisis perilaku transaksi berbasis histori.'].map((t) => (
              <div key={t} className="flex items-center gap-2 text-sm text-gray-700">
                <span className="mt-0.5 text-white bg-teal-900 rounded-full p-0.75"><Check size={13}/></span> {t}
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

      {/* [White-box + Audit] + Feature 2 */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          
          {/* White-box + Audit */}
          <div className="space-y-4">
            <div className='flex flex-row gap-4'>
              <div className="flex-1 border border-gray-200 rounded-xl p-6 justify-center items-center">
                <div className="text-2xl mb-2 flex justify-center text-teal-900"><Eye /></div>
                <p className="font-semibold text-gray-900 text-sm mb-2 text-center">White-Box Model</p>
                <p className="text-xs text-gray-500 mt-1 text-center">Logika keputusan yang dapat ditelusuri dan diaudit.</p>
              </div>
              <div className="flex-1 border border-gray-200 rounded-xl p-6 justify-center items-center">
                <div className="text-2xl mb-2 flex justify-center text-teal-900"><FileBarChart2 /></div>
                <p className="font-semibold text-gray-900 text-sm mb-2 text-center">Audit Trails</p>
                <p className="text-xs text-gray-500 mt-1 text-center">Log otomatis untuk setiap variabel.</p>
              </div>
            </div>
            
            <div className="border border-gray-200 rounded-xl p-6 bg-white shadow-sm">
              <p className="text-[10px] font-bold tracking-widest text-gray-400 mb-3 uppercase">Dampak (Variabel Dominan)</p>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-600">Zona Konflik Geopolitik</span>
                <span className="text-xs font-semibold text-amber-600">+42.5% Impact</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-2 bg-amber-500 w-3/5" />
              </div>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="md:pl-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 font-serif border-l-4 border-gray-900 pl-4">
              2. Explainable AI: Transparansi Logika
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed">
              CORTIA menghilangkan fenomena "kotak hitam" dalam AI. Setiap keputusan dipetakan melalui hierarki logika yang transparan, memungkinkan auditor memeriksa koefisien spesifik yang memicu peringatan risiko.
            </p>
          </div>

        </div>
      </section>

      {/* Feature 3 - EWS */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-4 mb-3">
            <div className="w-16 h-px bg-red-300" />
            <h2 className="text-2xl font-bold text-gray-900 font-serif">3. Pencegahan Real-Time (EWS)</h2>
            <div className="w-16 h-px bg-red-300" />
          </div>
          <p className="text-gray-500 text-sm max-w-lg mx-auto mb-12 leading-relaxed">
            Sistem Peringatan Dini (Early Warning System) yang dirancang untuk membekukan aset secara otomatis sebelum jendela kliring berakhir. Protokol pencegahan ini aktif berdasarkan ambang batas institusional yang telah ditentukan.
          </p>
          <div className="grid md:grid-cols-4 gap-6">
            {ewsSteps.map((step, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center text-center px-4">
                <div className={`w-14 h-14 ${step.bgColor} rounded-full flex items-center justify-center mb-6`}>
                  {step.icon}
                </div>
                <h3 className={`font-bold text-sm mb-2 ${step.titleColor || 'text-gray-800'}`}>
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