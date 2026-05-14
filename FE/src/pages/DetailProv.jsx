import React from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/ui/Navbar";
import Footer from "../components/ui/Footer";

const DetailProv = () => {
  const { id } = useParams();

  const projects = [
    {
      name: "Pembangunan Jembatan Layang Kuningan",
      category: "Jembatan",
      budget: "Rp 150M",
      status: "Kritis",
      color: "bg-red-500",
    },
    {
      name: "Rehabilitasi Drainase Menteng",
      category: "Fasilitas Umum",
      budget: "Rp 45M",
      status: "Anomali",
      color: "bg-orange-400",
    },
    {
      name: "Pelebaran Jalan Gatot Subroto",
      category: "Jalan",
      budget: "Rp 210M",
      status: "Stabil",
      color: "bg-emerald-500",
    },
    {
      name: "Normalisasi Kali Ciliwung Sektor 4",
      category: "Fasilitas Umum",
      budget: "Rp 380M",
      status: "Kritis",
      color: "bg-red-500",
    },
    {
      name: "Renovasi Trotoar Sudirman",
      category: "Jalan",
      budget: "Rp 12M",
      status: "Stabil",
      color: "bg-emerald-500",
    },
  ];

  return (
    <div className="pt-20 min-h-screen bg-slate-100">
      <div className="max-w-7xl mx-auto w-full py-6 space-y-6 px-6">

        <Navbar />

        {/* Header */}
        <div className="flex justify-between items-start border-b border-gray-300 pb-6">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase mb-1">
              Detail Provinsi
            </p>

            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-4xl font-bold text-slate-900">
                DKI Jakarta
              </h1>

              <span className="px-3 py-1 text-sm bg-slate-200 rounded-sm text-slate-700">
                ID: {id}
              </span>
            </div>

            <p className="text-slate-600">
              Analisis Forensik Digital Anggaran Infrastruktur Regional
            </p>
          </div>

          {/* Score */}
          <div className="border border-gray-300 bg-red-50 px-6 py-4 rounded-sm w-[320px]">
            <p className="text-xs font-semibold text-red-500 uppercase mb-2">
              Skor Anomali Keseluruhan
            </p>

            <div className="flex justify-between items-center">
              <h2 className="text-4xl font-bold text-red-500">
                8.9
                <span className="text-lg">/10</span>
              </h2>

              <div className="text-right">
                <span className="px-3 py-1 rounded-sm bg-red-500 text-white text-xs font-semibold">
                  KRITIS
                </span>

                <p className="text-xs text-red-500 mt-2">
                  Tingkat Risiko Tinggi Ditemukan
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-5">
          <StatCard
            title="Total Anggaran"
            value="Rp 4.2T"
            subtitle="TA 2024 - Alokasi Regional"
          />

          <StatCard
            title="Total Proyek"
            value="124"
            subtitle="Proyek Infrastruktur Aktif"
          />

          <StatCard
            title="Dana Anomali"
            value="Rp 850B"
            subtitle="Memerlukan Audit Lanjutan"
            warning
          />
        </div>

        {/* Content */}
        <div className="grid grid-cols-12 gap-5">

          {/* Table */}
          <div className="col-span-8 bg-white border border-gray-300 rounded-sm overflow-hidden">

            <div className="px-6 py-4 border-b border-gray-300">
              <h2 className="font-semibold text-lg">
                Daftar Proyek Infrastruktur
              </h2>
            </div>

            <table className="w-full text-sm">
              <thead className="bg-slate-100">
                <tr className="text-slate-600">
                  <th className="text-left px-6 py-3">
                    Nama Proyek
                  </th>

                  <th className="text-left px-6 py-3">
                    Kategori
                  </th>

                  <th className="text-left px-6 py-3">
                    Alokasi
                  </th>

                  <th className="text-left px-6 py-3">
                    Status
                  </th>

                  <th className="text-left px-6 py-3"></th>
                </tr>
              </thead>

              <tbody>
                {projects.map((project, index) => (
                  <tr
                    key={index}
                    className="border-t border-gray-300 hover:bg-slate-50"
                  >
                    <td className="px-6 py-4 font-medium">
                      {project.name}
                    </td>

                    <td className="px-6 py-4 text-slate-600">
                      {project.category}
                    </td>

                    <td className="px-6 py-4 font-semibold">
                      {project.budget}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`${project.color} text-white text-xs px-3 py-1 rounded-sm`}
                      >
                        {project.status}
                      </span>
                    </td>

                    <td className="px-6 py-4 font-semibold text-sm cursor-pointer">
                      LIHAT DETAIL
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Right */}
          <div className="col-span-4 space-y-5">

            {/* Sector */}
            <div className="bg-white border border-gray-300 rounded-sm px-6 py-5">
              <h2 className="font-semibold mb-5">
                Alokasi per Sektor
              </h2>

              <Progress label="Jalan" value={42} />
              <Progress label="Jembatan" value={28} />
              <Progress label="Fasilitas Umum" value={30} />
            </div>

            {/* Distribution */}
            <div className="bg-white border border-gray-300 rounded-sm px-6 py-5 h-80 flex flex-col justify-between">
              <h2 className="font-semibold">
                Distribusi Risiko Proyek
              </h2>

              <div className="flex-1"></div>

              <div className="space-y-3 text-sm">
                <Legend color="bg-red-500" label="Kritis" value="48" />
                <Legend color="bg-orange-400" label="Anomali" value="32" />
                <Legend color="bg-emerald-500" label="Stabil" value="44" />
              </div>
            </div>

          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

const StatCard = ({ title, value, subtitle, warning }) => (
  <div className="bg-white border border-gray-300 rounded-sm px-6 py-5">
    <p
      className={`text-xs font-semibold uppercase mb-4 ${
        warning ? "text-orange-500" : "text-slate-500"
      }`}
    >
      {title}
    </p>

    <h3
      className={`text-3xl font-bold mb-2 ${
        warning ? "text-orange-500" : "text-slate-900"
      }`}
    >
      {value}
    </h3>

    <p className="text-sm text-slate-500">
      {subtitle}
    </p>
  </div>
);

const Progress = ({ label, value }) => (
  <div className="mb-5">
    <div className="flex justify-between text-sm mb-2 font-medium">
      <span>{label}</span>
      <span>{value}%</span>
    </div>

    <div className="h-2 bg-slate-200 rounded-sm overflow-hidden">
      <div
        className="h-full bg-slate-800"
        style={{ width: `${value}%` }}
      />
    </div>
  </div>
);

const Legend = ({ color, label, value }) => (
  <div className="flex justify-between items-center">
    <div className="flex items-center gap-3">
      <div className={`w-3 h-3 rounded-sm ${color}`} />
      <span>{label}</span>
    </div>

    <span className="font-semibold">
      {value}
    </span>
  </div>
);

export default DetailProv;