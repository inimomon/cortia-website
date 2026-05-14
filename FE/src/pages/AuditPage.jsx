import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/ui/Navbar";
import { File as FileIcon } from "lucide-react";
import Footer from "../components/ui/Footer";
import HeroAudit from "../components/ui/HeroAudit";
import { LogIn, UserPlus } from "lucide-react";

const PORT = import.meta.env.VITE_BE_LINK;
const API = `${PORT}/audit`;

const REQUIRED_COLUMNS = [
  "nama_daerah",
  "tender_title",
  "tender_minvalue",
  "award_value",
  "award_date",
  "days_to_award",
  "mainprocurementcategory",
  "award_title",
  "award_supplier",
];

const NAMA_DAERAH_OPTIONS = [
  { label: "Aceh", value: "Aceh" },
  { label: "Bali", value: "Bali" },
  { label: "Banten", value: "Banten" },
  { label: "Bengkulu", value: "Bengkulu" },
  { label: "Daerah Istimewa Yogyakarta", value: "Daerah Istimewa Yogyakarta" },
  { label: "DKI Jakarta", value: "DKI Jakarta" },
  { label: "Gorontalo", value: "Gorontalo" },
  { label: "Jambi", value: "Jambi" },
  { label: "Jawa Barat", value: "Jawa Barat" },
  { label: "Jawa Tengah", value: "Jawa Tengah" },
  { label: "Jawa Timur", value: "Jawa Timur" },
  { label: "Kalimantan Barat", value: "Kalimantan Barat" },
  { label: "Kalimantan Selatan", value: "Kalimantan Selatan" },
  { label: "Kalimantan Tengah", value: "Kalimantan Tengah" },
  { label: "Kalimantan Timur", value: "Kalimantan Timur" },
  { label: "Kalimantan Utara", value: "Kalimantan Utara" },
  { label: "Kepulauan Bangka Belitung", value: "Kepulauan Bangka Belitung" },
  { label: "Kepulauan Riau", value: "Kepulauan Riau" },
  { label: "Lampung", value: "Lampung" },
  { label: "Maluku", value: "Maluku" },
  { label: "Maluku Utara", value: "Maluku Utara" },
  { label: "Nusa Tenggara Barat", value: "Nusa Tenggara Barat" },
  { label: "Nusa Tenggara Timur", value: "Nusa Tenggara Timur" },
  { label: "Papua", value: "Papua" },
  { label: "Papua Barat", value: "Papua Barat" },
  { label: "Riau", value: "Riau" },
  { label: "Sulawesi Barat", value: "Sulawesi Barat" },
  { label: "Sulawesi Selatan", value: "Sulawesi Selatan" },
  { label: "Sulawesi Tengah", value: "Sulawesi Tengah" },
  { label: "Sulawesi Tenggara", value: "Sulawesi Tenggara" },
  { label: "Sulawesi Utara", value: "Sulawesi Utara" },
  { label: "Sumatera Barat", value: "Sumatera Barat" },
  { label: "Sumatera Selatan", value: "Sumatera Selatan" },
  { label: "Sumatera Utara", value: "Sumatera Utara" },
];

const MAIN_PROCUREMENT_CATEGORY_OPTIONS = ["Goods", "Services", "Works"];

function Toast({ toasts }) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`px-4 py-3 rounded-lg shadow-lg text-sm font-medium text-white flex items-center gap-2 transition-all ${
            toast.type === "error"
              ? "bg-red-600"
              : toast.type === "warn"
                ? "bg-orange-500"
                : "bg-gray-900"
          }`}
        >
          <span>
            {toast.type === "error" ? "x" : toast.type === "warn" ? "!" : "ok"}
          </span>
          {toast.msg}
        </div>
      ))}
    </div>
  );
}

function LoginRequiredModal({ open, onLoginClick, onRegisterClick }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          Login Dibutuhkan
        </h2>

        <p className="text-gray-500 text-sm mb-8 leading-relaxed">
          Anda harus login atau mendaftar untuk menggunakan fitur analisis data
          pengadaan ini.
        </p>
        <div className="flex flex-col gap-3">
          <button
            onClick={onLoginClick}
            className="group w-full bg-gray-900 text-white font-medium py-3.5 rounded-xl hover:bg-black transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          >
            <LogIn className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />

            <span>Masuk ke Akun</span>
          </button>

          <button
            onClick={onRegisterClick}
            className="group w-full bg-white border border-gray-200 text-gray-900 font-medium py-3.5 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 flex items-center justify-center gap-2 shadow-sm hover:shadow-md hover:-translate-y-0.5"
          >
            <UserPlus className="w-4 h-4 transition-transform group-hover:scale-110" />

            <span>Daftar Sekarang</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function SettingsPanel({ open, onClose }) {
  const [settings] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("auditOldSettings") || "{}");
    } catch {
      return {};
    }
  });

  const merged = {
    notificationEmail: "",
    ...settings,
  };

  const save = () => {
    localStorage.setItem("auditOldSettings", JSON.stringify(merged));
    onClose();
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-gray-900">Pengaturan Audit</h2>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 text-xl"
          >
            x
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1">
              Email Notifikasi
            </label>

            <input
              type="email"
              defaultValue={merged.notificationEmail}
              onChange={(event) => {
                merged.notificationEmail = event.target.value;
              }}
              placeholder="admin@example.com"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
            />
          </div>
        </div>

        <div className="mt-6 flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-500 hover:text-gray-800"
          >
            Batal
          </button>

          <button
            onClick={save}
            className="px-5 py-2 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-700"
          >
            Simpan Pengaturan
          </button>
        </div>
      </div>
    </div>
  );
}

function SearchableNamaDaerah({ value, onChange }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const selected = NAMA_DAERAH_OPTIONS.find(
      (option) => option.value === value,
    );

    setQuery(selected ? selected.label : "");
  }, [value]);

  const filteredOptions = NAMA_DAERAH_OPTIONS.filter((option) => {
    const needle = query.trim().toLowerCase();

    if (!needle) return true;

    return (
      option.label.toLowerCase().includes(needle) ||
      option.value.toLowerCase().includes(needle)
    );
  });

  const commitQuery = () => {
    const normalized = query.trim().toLowerCase();

    const matched = NAMA_DAERAH_OPTIONS.find(
      (option) =>
        option.label.toLowerCase() === normalized ||
        option.value.toLowerCase() === normalized,
    );

    if (matched) {
      onChange(matched.value);
      setQuery(matched.label);
      return;
    }

    if (!normalized) {
      onChange("");
      setQuery("");
      return;
    }

    const selected = NAMA_DAERAH_OPTIONS.find(
      (option) => option.value === value,
    );

    setQuery(selected ? selected.label : "");
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={query}
        onFocus={() => setOpen(true)}
        onChange={(event) => {
          setQuery(event.target.value);
          setOpen(true);
        }}
        onBlur={() => {
          window.setTimeout(() => {
            commitQuery();
            setOpen(false);
          }, 120);
        }}
        placeholder="Cari satu dari 34 provinsi..."
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
      />

      {value && <p className="mt-1 text-xs text-gray-500">Kode: {value}</p>}

      {open && filteredOptions.length > 0 && (
        <div className="absolute z-20 mt-1 max-h-56 w-full overflow-auto rounded-lg border border-gray-200 bg-white shadow-lg">
          {filteredOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => {
                onChange(option.value);
                setQuery(option.label);
                setOpen(false);
              }}
              className="flex w-full items-start justify-between gap-3 px-3 py-2 text-left text-sm hover:bg-gray-50"
            >
              <span className="text-gray-800">{option.label}</span>
              <span className="text-xs text-gray-400">{option.value}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function AuditOldPage() {
  const navigate = useNavigate();

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [tab, setTab] = useState("upload");
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [analyzeResult, setAnalyzeResult] = useState(null);
  const [audits, setAudits] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [riskFilter, setRiskFilter] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [manualForm, setManualForm] = useState({
    tender_title: "",
    tender_minvalue: "",
    award_value: "",
    award_date: "",
    days_to_award: "",
    mainprocurementcategory: "",
    award_title: "",
    award_supplier: "",
    nama_daerah: "",
  });

  const [manualLoading, setManualLoading] = useState(false);

  const fileRef = useRef(null);
  const searchTimer = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setShowLoginModal(true);
    }
  }, []);

  const handleLoginClick = () => {
    navigate("/login");
  };

  const handleRegisterClick = () => {
    navigate("/register");
  };

  const toast = (msg, type = "success") => {
    const id = Date.now();

    setToasts((current) => [...current, { id, msg, type }]);

    setTimeout(() => {
      setToasts((current) => current.filter((item) => item.id !== id));
    }, 4000);
  };

  const fetchAudits = useCallback(
    async (q = search, risk = riskFilter, currentPage = page) => {
      try {
        const params = new URLSearchParams({
          page: currentPage,
          limit: 8,
        });

        if (q) params.set("q", q);
        if (risk) params.set("risk", risk);

        const response = await fetch(`${API}?${params}`);
        const data = await response.json();

        if (data.success) {
          setAudits(data.data || []);
          setTotal(data.total || 0);
        }
      } catch (error) {
        console.error("FETCH AUDITS ERROR:", error);
      }
    },
    [page, riskFilter, search],
  );

  useEffect(() => {
    fetchAudits();
  }, [fetchAudits]);

  const handleFileSelect = (selectedFile) => {
    if (!selectedFile) return;

    const ext = selectedFile.name.split(".").pop().toLowerCase();

    if (!["xlsx", "csv"].includes(ext)) {
      toast("Hanya file .xlsx atau .csv yang diperbolehkan", "error");
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      toast("File terlalu besar. Ukuran maksimal 10 MB.", "error");
      return;
    }

    setFile(selectedFile);
    setUploadResult(null);
    setAnalyzeResult(null);
  };

  const handleUpload = async () => {
    if (!file) {
      toast("Silakan pilih file terlebih dahulu", "warn");
      return;
    }

    setUploading(true);
    setUploadResult(null);
    setAnalyzeResult(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`${API}/upload`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        toast(data.message || "Upload dan analisis gagal", "error");
        return;
      }

      setUploadResult(data);
      setAnalyzeResult(data.summary);
      toast(`Analisis selesai. ${data.rows} baris diproses.`);

      setFile(null);
      fetchAudits();

      if (data.auditId) {
        navigate(`/analisa/${data.auditId}`);
      }
    } catch (error) {
      console.error("UPLOAD ERROR:", error);
      toast("Gagal mengunggah dan menganalisis file", "error");
    } finally {
      setUploading(false);
    }
  };

  const handleManualSubmit = async () => {
    const missing = REQUIRED_COLUMNS.find(
      (column) => !String(manualForm[column] || "").trim(),
    );

    if (missing) {
      toast(`${missing} diperlukan`, "warn");
      return;
    }

    if (
      !MAIN_PROCUREMENT_CATEGORY_OPTIONS.includes(
        manualForm.mainprocurementcategory,
      )
    ) {
      toast("Silakan pilih kategori pengadaan yang valid", "warn");
      return;
    }

    setManualLoading(true);
    setAnalyzeResult(null);

    try {
      const payload = {
        ...manualForm,
        tender_minvalue: Number(manualForm.tender_minvalue),
        award_value: Number(manualForm.award_value),
        days_to_award: Number(manualForm.days_to_award),
      };

      const response = await fetch(`${API}/manual`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        toast(data.message || "Analisis manual gagal", "error");
        return;
      }

      setAnalyzeResult(data.summary);
      toast("Analisis manual berhasil");

      setManualForm({
        tender_title: "",
        tender_minvalue: "",
        award_value: "",
        award_date: "",
        days_to_award: "",
        mainprocurementcategory: "",
        award_title: "",
        award_supplier: "",
        nama_daerah: "",
      });

      fetchAudits();

      if (data.auditId) {
        navigate(`/analisa/${data.auditId}`);
      }
    } catch (error) {
      console.error("MANUAL ERROR:", error);
      toast("Terjadi kesalahan jaringan", "error");
    } finally {
      setManualLoading(false);
    }
  };

  const handleDownloadTemplate = () => {
    window.location.href = `${API}/template`;
  };

  const handleSearch = (value) => {
    setSearch(value);

    clearTimeout(searchTimer.current);

    searchTimer.current = setTimeout(() => {
      setPage(1);
      fetchAudits(value, riskFilter, 1);
    }, 400);
  };

  const handleRiskFilter = (value) => {
    setRiskFilter(value);
    setPage(1);
    fetchAudits(search, value, 1);
  };

  const totalPages = Math.ceil(total / 8);

  return (
    <div className="min-h-screen bg-white font-sans">
      <Navbar variant="internal" />

      <LoginRequiredModal
        open={showLoginModal}
        onLoginClick={handleLoginClick}
        onRegisterClick={handleRegisterClick}
      />

      <Toast toasts={toasts} />

      <SettingsPanel
        open={showSettings}
        onClose={() => setShowSettings(false)}
      />

      <HeroAudit />

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-10">
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          <div className="md:col-span-2 border border-gray-200 rounded-xl overflow-hidden">
            <div className="flex border-b border-gray-200">
              {["upload", "manual"].map((currentTab) => (
                <button
                  key={currentTab}
                  onClick={() => {
                    setTab(currentTab);
                    setAnalyzeResult(null);
                    setUploadResult(null);
                  }}
                  className={`px-5 py-3 text-sm font-medium uppercase tracking-wide transition-colors ${
                    tab === currentTab
                      ? "border-b-2 border-gray-900 text-gray-900"
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  {currentTab === "upload" ? "Unggah File" : "Entri Manual"}
                </button>
              ))}
            </div>

            <div className="p-6">
              {tab === "upload" ? (
                <>
                  <div
                    className={`border-2 border-dashed rounded-xl p-6 md:p-8 flex flex-col items-center justify-center h-64 md:h-128 cursor-pointer transition-colors ${
                      dragging
                        ? "border-gray-400 bg-gray-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onDragOver={(event) => {
                      event.preventDefault();
                      setDragging(true);
                    }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={(event) => {
                      event.preventDefault();
                      setDragging(false);
                      handleFileSelect(event.dataTransfer.files[0]);
                    }}
                  >
                    <input
                      ref={fileRef}
                      type="file"
                      accept=".xlsx,.csv"
                      className="hidden"
                      onChange={(event) =>
                        handleFileSelect(event.target.files[0])
                      }
                    />

                    <div className="text-2xl md:text-3xl mb-3">
                      <FileIcon />
                    </div>

                    <p className="font-semibold text-gray-800 mb-1 text-sm">
                      Unggah data pengadaan untuk dianalisis
                    </p>

                    <p className="text-xs md:text-sm text-gray-500 mb-2">
                      Spreadsheet harus berisi kolom-kolom yang diperlukan oleh
                      sistem analisis.
                    </p>

                    <span className="text-xs text-gray-400 border border-gray-200 rounded px-2 py-1">
                      .xlsx / .csv · max 10 MB
                    </span>

                    {file && (
                      <p className="mt-3 text-xs text-emerald-600 font-medium">
                        Dipilih: {file.name}
                      </p>
                    )}

                    <button
                      type="button"
                      onClick={() => fileRef.current?.click()}
                      className="mt-4 bg-gray-900 text-white text-xs md:text-sm px-5 md:px-6 py-2 md:py-2.5 rounded-lg hover:bg-gray-700 transition-colors font-medium"
                    >
                      PILIH FILE
                    </button>
                  </div>

                  {uploadResult && (
                    <div className="mt-3 bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-3 text-sm text-emerald-700">
                      {uploadResult.rows} baris berhasil dianalisis dari{" "}
                      <strong>{uploadResult.filename}</strong>.
                    </div>
                  )}

                  {analyzeResult && (
                    <div className="mt-3 bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 text-sm text-blue-700 flex flex-wrap gap-4">
                      <span>Analisis selesai.</span>

                      <span className="text-red-600 font-semibold">
                        Tinggi: {analyzeResult.high_risk ?? 0}
                      </span>

                      <span className="text-orange-500 font-semibold">
                        Sedang: {analyzeResult.medium_risk ?? 0}
                      </span>

                      <span className="text-emerald-600 font-semibold">
                        Rendah: {analyzeResult.low_risk ?? 0}
                      </span>
                    </div>
                  )}

                  <div className="mt-4 flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
                    <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                      <button
                        onClick={handleUpload}
                        disabled={!file || uploading}
                        className="bg-blue-600 text-white text-xs md:text-sm px-4 md:px-5 py-2 md:py-2.5 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                      >
                        {uploading ? "Menganalisis..." : "Upload & Analisis"}
                      </button>
                    </div>
                  </div>

                  <div className="mt-2 text-right">
                    <button
                      onClick={handleDownloadTemplate}
                      className="text-xs text-gray-500 hover:text-gray-800 transition-colors"
                    >
                      Unduh Template
                    </button>
                  </div>
                </>
              ) : (
                <div className="space-y-4">
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      Analisis Tender Secara Manual
                    </h2>

                    <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
                      Masukkan detail proyek pengadaan untuk dianalisis oleh
                      sistem AI. Sistem akan membantu mendeteksi potensi
                      anomali, ketidakwajaran nilai kontrak, dan pola tender
                      yang berisiko.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">
                      Provinsi / Daerah Pengadaan *
                    </label>

                    <SearchableNamaDaerah
                      value={manualForm.nama_daerah}
                      onChange={(nextValue) =>
                        setManualForm((current) => ({
                          ...current,
                          nama_daerah: nextValue,
                        }))
                      }
                    />
                  </div>

                  {[
                    {
                      label: "Nama Proyek / Tender *",
                      key: "tender_title",
                      placeholder: "Contoh: Pembangunan Jalan Nasional Tahap 2",
                    },
                    {
                      label: "Estimasi Anggaran Tender (Rp) *",
                      key: "tender_minvalue",
                      type: "number",
                      placeholder: "Contoh: 1500000000",
                    },
                    {
                      label: "Nilai Kontrak yang Disetujui (Rp) *",
                      key: "award_value",
                      type: "number",
                      placeholder: "Contoh: 1425000000",
                    },
                    {
                      label: "Tanggal Penetapan Pemenang *",
                      key: "award_date",
                      type: "date",
                    },
                    {
                      label: "Durasi Tender Sampai Penetapan (Hari) *",
                      key: "days_to_award",
                      type: "number",
                      placeholder: "Contoh: 14",
                    },
                  ].map((field) => (
                    <div key={field.key}>
                      <label className="block text-xs font-medium text-gray-600 mb-1.5">
                        {field.label}
                      </label>

                      <input
                        type={field.type || "text"}
                        placeholder={field.placeholder}
                        value={manualForm[field.key]}
                        onChange={(event) =>
                          setManualForm((current) => ({
                            ...current,
                            [field.key]: event.target.value,
                          }))
                        }
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
                      />
                    </div>
                  ))}

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">
                      Jenis Pengadaan *
                    </label>

                    <select
                      value={manualForm.mainprocurementcategory}
                      onChange={(event) =>
                        setManualForm((current) => ({
                          ...current,
                          mainprocurementcategory: event.target.value,
                        }))
                      }
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gray-300"
                    >
                      <option value="">Pilih jenis pengadaan</option>

                      {MAIN_PROCUREMENT_CATEGORY_OPTIONS.map((option) => (
                        <option key={option} value={option}>
                          {option === "Goods"
                            ? "Barang"
                            : option === "Services"
                              ? "Jasa"
                              : "Pekerjaan Konstruksi"}
                        </option>
                      ))}
                    </select>
                  </div>

                  {[
                    {
                      label: "Nama Kontrak / Paket Pekerjaan *",
                      key: "award_title",
                      placeholder: "Contoh: Kontrak Pembangunan Jalan Nasional",
                    },
                    {
                      label: "Perusahaan / Vendor Pemenang Tender *",
                      key: "award_supplier",
                      placeholder: "Contoh: PT Maju Infrastruktur Indonesia",
                    },
                  ].map((field) => (
                    <div key={field.key}>
                      <label className="block text-xs font-medium text-gray-600 mb-1.5">
                        {field.label}
                      </label>

                      <input
                        type="text"
                        placeholder={field.placeholder}
                        value={manualForm[field.key]}
                        onChange={(event) =>
                          setManualForm((current) => ({
                            ...current,
                            [field.key]: event.target.value,
                          }))
                        }
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
                      />
                    </div>
                  ))}

                  <button
                    onClick={handleManualSubmit}
                    disabled={manualLoading}
                    className="w-full bg-gray-900 text-white text-sm py-3 rounded-xl hover:bg-gray-700 transition-colors disabled:opacity-50 font-medium"
                  >
                    {manualLoading ? "Menganalisis..." : "Analisis Data Tender"}
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="border border-gray-200 rounded-xl p-5">
            <h3 className="font-semibold text-gray-900 mb-4 text-sm">
              Data Analisis
            </h3>

            <div className="mb-4">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Kolom Wajib
              </p>

              <ul className="space-y-1.5">
                {REQUIRED_COLUMNS.map((field) => (
                  <li key={field} className="text-xs text-gray-600 flex gap-2">
                    <span className="text-gray-300 mt-0.5">-</span>
                    {field}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mb-4">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Hasil Analisis
              </p>

              <div className="space-y-2">
                {[
                  { label: "score", desc: "Skor anomali dari sistem" },
                  { label: "risk_level", desc: "rendah / sedang / tinggi" },
                  {
                    label: "explanation",
                    desc: "Penjelasan hasil analisis dari model",
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-lg border border-gray-200 p-3"
                  >
                    <p className="text-xs font-semibold text-gray-800">
                      {item.label}
                    </p>

                    <p className="text-xs text-gray-500 mt-1">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-500 leading-relaxed">
                Pastikan setiap baris yang diunggah sesuai dengan format yang
                diperlukan sistem agar dapat dianalisis dengan akurat.
              </p>
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
            <h2 className="text-xl font-bold text-gray-900 font-serif">
              Riwayat Analisis
            </h2>

            <div className="flex items-center gap-2">
              <select
                value={riskFilter}
                onChange={(event) => handleRiskFilter(event.target.value)}
                className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none text-gray-600"
              >
                <option value="">Semua Risiko</option>
                <option value="high">Tinggi</option>
                <option value="medium">Sedang</option>
                <option value="low">Rendah</option>
              </select>

              <button
                onClick={() => setShowSearch((current) => !current)}
                className="text-gray-400 hover:text-gray-700 text-sm px-2 py-1.5 border border-gray-200 rounded-lg transition-colors"
                title="Cari"
              >
                Cari
              </button>

              <button
                onClick={() => setShowSettings(true)}
                className="text-gray-400 hover:text-gray-700 text-sm px-2 py-1.5 border border-gray-200 rounded-lg transition-colors"
                title="Pengaturan"
              >
                Pengaturan
              </button>
            </div>
          </div>

          {showSearch && (
            <div className="mb-4">
              <input
                type="text"
                value={search}
                onChange={(event) => handleSearch(event.target.value)}
                placeholder="Cari berdasarkan judul, supplier, atau daerah..."
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
              />
            </div>
          )}

          <div className="border border-gray-200 rounded-xl overflow-hidden">
            {audits.length === 0 ? (
              <div className="py-16 text-center">
                <div className="text-4xl mb-3 font-bold text-gray-900">
                  Analisis
                </div>

                <p className="text-gray-500 text-sm">
                  Tidak ada data analisis. Unggah dan analisis file untuk
                  memulai.
                </p>
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    {[
                      "#",
                      "Nama File",
                      "Baris",
                      "Tinggi",
                      "Sedang",
                      "Rendah",
                      "Status",
                      "Tanggal",
                      "Aksi",
                    ].map((header) => (
                      <th
                        key={header}
                        className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {audits.map((row, index) => (
                    <tr
                      key={row.id}
                      className={`border-b border-gray-50 hover:bg-gray-50 transition-colors ${
                        index === audits.length - 1 ? "border-0" : ""
                      }`}
                    >
                      <td className="px-4 py-3 text-sm font-medium text-blue-600">
                        #{row.id}
                      </td>

                      <td
                        className="px-4 py-3 text-sm text-gray-700 max-w-[140px] truncate"
                        title={row.filename}
                      >
                        {row.filename}
                      </td>

                      <td className="px-4 py-3 text-sm text-gray-700">
                        {row.total_rows}
                      </td>

                      <td className="px-4 py-3 text-sm font-bold text-red-600">
                        {row.high_risk}
                      </td>

                      <td className="px-4 py-3 text-sm font-bold text-orange-500">
                        {row.medium_risk}
                      </td>

                      <td className="px-4 py-3 text-sm font-bold text-emerald-600">
                        {row.low_risk}
                      </td>

                      <td className="px-4 py-3">
                        <span
                          className={`text-xs font-semibold px-2 py-0.5 rounded capitalize ${
                            row.status === "completed"
                              ? "bg-emerald-100 text-emerald-700"
                              : row.status === "failed"
                                ? "bg-red-100 text-red-700"
                                : row.status === "processing"
                                  ? "bg-blue-100 text-blue-700"
                                  : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {row.status === "completed"
                            ? "Selesai"
                            : row.status === "failed"
                              ? "Gagal"
                              : row.status === "processing"
                                ? "Diproses"
                                : row.status}
                        </span>
                      </td>

                      <td className="px-4 py-3 text-xs text-gray-500">
                        {new Date(row.created_at).toLocaleDateString("id-ID")}
                      </td>

                      <td className="px-4 py-3">
                        <button
                          onClick={() =>
                            navigate(`/analisa/${row.transaction_id}`)
                          }
                          className="text-sm text-teal-700 font-medium hover:text-teal-900 cursor-pointer whitespace-nowrap"
                        >
                          Detail
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-4">
              <button
                onClick={() => {
                  const nextPage = Math.max(1, page - 1);
                  setPage(nextPage);
                  fetchAudits(search, riskFilter, nextPage);
                }}
                disabled={page === 1}
                className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40"
              >
                Sebelumnya
              </button>

              <span className="text-sm text-gray-500">
                Halaman {page} / {totalPages}
              </span>

              <button
                onClick={() => {
                  const nextPage = Math.min(totalPages, page + 1);
                  setPage(nextPage);
                  fetchAudits(search, riskFilter, nextPage);
                }}
                disabled={page === totalPages}
                className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40"
              >
                Berikutnya
              </button>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
