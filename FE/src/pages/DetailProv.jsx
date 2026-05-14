import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/ui/Navbar';
import Footer from '../components/ui/Footer';
import { fetchProvinceDetail } from '../lib/predictionApi';

const statusClasses = {
  KRITIS: 'bg-red-500 text-white',
  ANOMALI: 'bg-orange-400 text-white',
  STABIL: 'bg-emerald-500 text-white',
};

const riskPanelClass = (status) => {
  if (status === 'KRITIS') return 'border-red-200 bg-red-50';
  if (status === 'ANOMALI') return 'border-orange-200 bg-orange-50';
  return 'border-emerald-200 bg-emerald-50';
};

const riskTextClass = (status) => {
  if (status === 'KRITIS') return 'text-red-500';
  if (status === 'ANOMALI') return 'text-orange-500';
  return 'text-emerald-600';
};

const riskBarClass = (status) => {
  if (status === 'KRITIS') return 'bg-red-500';
  if (status === 'ANOMALI') return 'bg-orange-400';
  return 'bg-emerald-500';
};

function ProjectDetailModal({ project, onClose }) {
  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/45 p-4 flex items-center justify-center" onClick={onClose}>
      <div className="w-full max-w-3xl rounded-2xl bg-white shadow-2xl" onClick={(event) => event.stopPropagation()}>
        <div className="px-6 py-5 border-b border-gray-200 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Detail Proyek</p>
            <h2 className="text-xl font-bold text-slate-900">{project.name}</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 text-xl leading-none">x</button>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            {[
              ['Kategori', project.category],
              ['Status', project.status],
              ['Skor', `${project.score}/10`],
              ['Harga Awal', project.harga_awal_formatted],
              ['Harga Final', project.harga_final_formatted],
              ['Gap Harga', project.gap_harga_formatted],
            ].map(([label, value]) => (
              <div key={label} className="rounded-xl border border-gray-200 p-4">
                <p className="text-xs text-slate-500 uppercase mb-1">{label}</p>
                <p className="text-sm font-semibold text-slate-900 break-words">{value || '-'}</p>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-gray-200 p-5">
            <p className="text-xs font-semibold text-slate-500 uppercase mb-3">Analisis Forensik AI</p>
            <div className="grid md:grid-cols-3 gap-3 mb-4">
              {(project.explanationItems?.length ? project.explanationItems : []).map((item, index) => (
                <div key={`${item.parameter}-${index}`} className="rounded-xl bg-slate-50 p-4 border border-slate-200">
                  <p className="text-xs font-semibold text-slate-500 uppercase mb-2">{item.parameter}</p>
                  <p className="text-sm text-slate-700">{item.insight}</p>
                </div>
              ))}
            </div>
            <div className="rounded-xl bg-slate-950 text-slate-100 p-4">
              <pre className="whitespace-pre-wrap text-sm font-sans">{project.explanation || 'Belum ada penjelasan dari model FastAPI.'}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const DetailProv = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [payload, setPayload] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    let active = true;

    fetchProvinceDetail(id)
      .then((response) => {
        if (!active) return;
        if (response.success) {
          setPayload(response.data);
        } else {
          setError('Detail provinsi gagal dimuat.');
        }
      })
      .catch(() => {
        if (active) {
          setError('Detail provinsi belum bisa diakses dari backend.');
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [id]);

  const summary = payload?.summary;
  const projects = payload?.projects || [];

  const sectorBreakdown = useMemo(() => {
    if (!summary?.categoryBreakdown) return [];
    return summary.categoryBreakdown;
  }, [summary]);

  if (loading) {
    return (
      <div className="pt-20 min-h-screen bg-slate-100">
        <Navbar variant="internal" />
        <div className="max-w-7xl mx-auto w-full py-20 px-6 text-center text-slate-500">
          Memuat detail provinsi...
        </div>
      </div>
    );
  }

  if (error || !summary) {
    return (
      <div className="pt-20 min-h-screen bg-slate-100">
        <Navbar variant="internal" />
        <div className="max-w-5xl mx-auto w-full py-20 px-6">
          <div className="bg-white rounded-2xl border border-red-200 p-8 text-center">
            <p className="text-red-600 font-semibold mb-4">{error || 'Data provinsi tidak ditemukan.'}</p>
            <button
              onClick={() => navigate('/explore')}
              className="px-4 py-2 rounded-lg bg-slate-900 text-white text-sm"
            >
              Kembali ke explore
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen bg-slate-100">
      <ProjectDetailModal project={selectedProject} onClose={() => setSelectedProject(null)} />

      <div className="max-w-7xl mx-auto w-full py-6 space-y-6 px-6">
        <Navbar variant="internal" />

        <div className="flex flex-wrap justify-between items-start gap-6 border-b border-gray-300 pb-6">
          <div>
            <button onClick={() => navigate('/explore')} className="text-sm text-slate-500 hover:text-slate-800 mb-4">
              Kembali ke explore
            </button>

            <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Detail Provinsi</p>

            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <h1 className="text-4xl font-bold text-slate-900">{summary.daerah}</h1>
              <span className="px-3 py-1 text-sm bg-slate-200 rounded-sm text-slate-700">Key: {summary.key}</span>
            </div>

            <p className="text-slate-600">Analisis Forensik Digital Anggaran Infrastruktur Regional berbasis hasil prediction.</p>
          </div>

          <div className={`border px-6 py-4 rounded-sm w-full max-w-sm ${riskPanelClass(summary.status)}`}>
            <p className={`text-xs font-semibold uppercase mb-2 ${riskTextClass(summary.status)}`}>Skor Anomali Keseluruhan</p>

            <div className="flex justify-between items-center gap-4">
              <h2 className={`text-4xl font-bold ${riskTextClass(summary.status)}`}>
                {summary.skorAnomali}
                <span className="text-lg">/10</span>
              </h2>

              <div className="text-right">
                <span className={`px-3 py-1 rounded-sm text-xs font-semibold ${statusClasses[summary.status] || statusClasses.STABIL}`}>
                  {summary.status}
                </span>
                <p className={`text-xs mt-2 ${riskTextClass(summary.status)}`}>Pengelompokan berdasarkan nama daerah / provinsi</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          <StatCard
            title="Total Anggaran"
            value={summary.totalAnggaranFormatted}
            subtitle="Total uang yang dibelanjakan pada provinsi ini"
          />

          <StatCard
            title="Total Proyek"
            value={String(summary.totalProyek)}
            subtitle="Total proyek hasil group by nama daerah"
          />

          <StatCard
            title="Dana Anomali"
            value={summary.danaAnomaliFormatted}
            subtitle="Akumulasi dari seluruh harga_final prediction"
            warning
          />
        </div>

        <div className="grid lg:grid-cols-12 gap-5">
          <div className="lg:col-span-8 space-y-5">
            <div className="bg-white border border-gray-300 rounded-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-300">
                <h2 className="font-semibold text-lg">Daftar Proyek Infrastruktur</h2>
                <p className="text-sm text-slate-500 mt-1">Semua proyek diambil langsung dari prediction berdasarkan provinsi terpilih.</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-100">
                    <tr className="text-slate-600">
                      <th className="text-left px-6 py-3">Nama Proyek</th>
                      <th className="text-left px-6 py-3">Kategori</th>
                      <th className="text-left px-6 py-3">Alokasi</th>
                      <th className="text-left px-6 py-3">Status</th>
                      <th className="text-left px-6 py-3"></th>
                    </tr>
                  </thead>

                  <tbody>
                    {projects.map((project) => (
                      <tr key={project.id} className="border-t border-gray-300 hover:bg-slate-50">
                        <td className="px-6 py-4 font-medium text-slate-900">{project.name}</td>
                        <td className="px-6 py-4 text-slate-600">{project.category}</td>
                        <td className="px-6 py-4 font-semibold">{project.budgetFormatted}</td>
                        <td className="px-6 py-4">
                          <span className={`text-xs px-3 py-1 rounded-sm ${statusClasses[project.status] || statusClasses.STABIL}`}>
                            {project.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => setSelectedProject(project)}
                            className="font-semibold text-sm text-slate-800 hover:text-black"
                          >
                            LIHAT DETAIL
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-white border border-gray-300 rounded-sm px-6 py-5">
              <h2 className="font-semibold mb-5">Analisis Forensik AI</h2>
              {summary.topProject ? (
                <div className="space-y-4">
                  <div>
                    <p className="text-xs uppercase font-semibold text-slate-500 mb-1">Proyek dengan skor tertinggi</p>
                    <h3 className="text-xl font-bold text-slate-900">{summary.topProject.tender_title || 'Tanpa judul proyek'}</h3>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    {(summary.topProject.explanationItems?.length ? summary.topProject.explanationItems : []).map((item, index) => (
                      <div key={`${item.parameter}-${index}`} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                        <p className="text-xs font-semibold uppercase text-slate-500 mb-2">{item.parameter}</p>
                        <p className="text-sm text-slate-700">{item.insight}</p>
                      </div>
                    ))}
                  </div>

                  <div className="rounded-xl bg-slate-950 text-slate-100 p-4">
                    <pre className="whitespace-pre-wrap text-sm font-sans">{summary.topProject.explanation || 'Belum ada penjelasan dari model FastAPI.'}</pre>
                  </div>
                </div>
              ) : (
                <p className="text-slate-500 text-sm">Belum ada penjelasan forensik dari prediction.</p>
              )}
            </div>
          </div>

          <div className="lg:col-span-4 space-y-5">
            <div className="bg-white border border-gray-300 rounded-sm px-6 py-5">
              <h2 className="font-semibold mb-5">Alokasi per Infrastruktur</h2>

              {sectorBreakdown.length > 0 ? (
                sectorBreakdown.map((item) => (
                  <Progress key={item.name} label={item.name} value={item.percentage} />
                ))
              ) : (
                <p className="text-sm text-slate-500">Belum ada kategori infrastruktur.</p>
              )}
            </div>

            <div className="bg-white border border-gray-300 rounded-sm px-6 py-5">
              <h2 className="font-semibold mb-5">Distribusi Risiko Proyek</h2>

              <div className="space-y-3 text-sm">
                <Legend color="bg-red-500" label="Kritis" value={String(summary.riskCounts?.high || 0)} />
                <Legend color="bg-orange-400" label="Anomali" value={String(summary.riskCounts?.medium || 0)} />
                <Legend color="bg-emerald-500" label="Stabil" value={String(summary.riskCounts?.low || 0)} />
              </div>
            </div>

            <div className="bg-white border border-gray-300 rounded-sm px-6 py-5">
              <h2 className="font-semibold mb-5">Ringkasan Proyek Tertinggi</h2>
              {summary.topProject ? (
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-slate-500 uppercase mb-1">Nama Proyek</p>
                    <p className="font-semibold text-slate-900">{summary.topProject.tender_title}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase mb-1">Nilai Final</p>
                    <p className="font-semibold text-slate-900">{summary.topProject.harga_final_formatted}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase mb-1">Skor</p>
                    <p className={`font-semibold ${riskTextClass(summary.status)}`}>{Number((summary.topProject.score || 0) * 10).toFixed(2)}/10</p>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-slate-500">Belum ada proyek unggulan untuk diringkas.</p>
              )}
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
    <p className={`text-xs font-semibold uppercase mb-4 ${warning ? 'text-orange-500' : 'text-slate-500'}`}>{title}</p>

    <h3 className={`text-3xl font-bold mb-2 ${warning ? 'text-orange-500' : 'text-slate-900'}`}>{value}</h3>

    <p className="text-sm text-slate-500">{subtitle}</p>
  </div>
);

const Progress = ({ label, value }) => (
  <div className="mb-5">
    <div className="flex justify-between text-sm mb-2 font-medium gap-3">
      <span className="text-slate-700">{label}</span>
      <span className="text-slate-500">{value}%</span>
    </div>

    <div className="h-2 bg-slate-200 rounded-sm overflow-hidden">
      <div className={`h-full ${riskBarClass(value >= 50 ? 'KRITIS' : value >= 25 ? 'ANOMALI' : 'STABIL')}`} style={{ width: `${value}%` }} />
    </div>
  </div>
);

const Legend = ({ color, label, value }) => (
  <div className="flex justify-between items-center">
    <div className="flex items-center gap-3">
      <div className={`w-3 h-3 rounded-sm ${color}`} />
      <span>{label}</span>
    </div>

    <span className="font-semibold">{value}</span>
  </div>
);

export default DetailProv;
