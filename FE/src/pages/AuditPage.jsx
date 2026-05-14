import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
// import Navbar from '../components/Navbar';
import Navbar from '../components/ui/Navbar';
import { File } from 'lucide-react';
import Footer from '../components/ui/Footer';

const PORT = import.meta.env.PORT || '8001';
const API = `http://localhost:${PORT}/api/audit`;
const REQUIRED_COLUMNS = [
  'nama_daerah',
  'tender_title',
  'tender_minvalue',
  'award_value',
  'award_date',
  'days_to_award',
  'mainprocurementcategory',
  'award_title',
  'award_supplier',
];
const NAMA_DAERAH_OPTIONS = [
  { label: 'Aceh', value: 'aceh_106' },
  { label: 'Bali', value: 'bali_33' },
  { label: 'Banten', value: 'banten_99' },
  { label: 'Bengkulu', value: 'bengkulu_267' },
  { label: 'Daerah Istimewa Yogyakarta', value: 'daerah_istimewa_yogyakarta_13' },
  { label: 'DKI Jakarta', value: 'dki_jakarta_127' },
  { label: 'Gorontalo', value: 'gorontalo_18' },
  { label: 'Jambi', value: 'jambi_70' },
  { label: 'Jawa Barat', value: 'jawa_barat_14' },
  { label: 'Jawa Tengah', value: 'jawa_tengah_42' },
  { label: 'Jawa Timur', value: 'jawa_timur_15' },
  { label: 'Kalimantan Barat', value: 'kalimantan_barat_97' },
  { label: 'Kalimantan Selatan', value: 'kalimantan_selatan_181' },
  { label: 'Kalimantan Tengah', value: 'kalimantan_tengah_12' },
  { label: 'Kalimantan Timur', value: 'kalimantan_timur_35' },
  { label: 'Kalimantan Utara', value: 'kalimantan_utara_716' },
  { label: 'Kepulauan Bangka Belitung', value: 'kepulauan_bangka_belitung_86' },
  { label: 'Kepulauan Riau', value: 'kepulauan_riau_22' },
  { label: 'Lampung', value: 'lampung_121' },
  { label: 'Maluku', value: 'maluku_288' },
  { label: 'Maluku Utara', value: 'maluku_utara_361' },
  { label: 'Nusa Tenggara Barat', value: 'nusa_tenggara_barat_37' },
  { label: 'Nusa Tenggara Timur', value: 'nusa_tenggara_timur_131' },
  { label: 'Papua', value: 'papua_41' },
  { label: 'Papua Barat', value: 'papua_barat_641' },
  { label: 'Riau', value: 'riau_39' },
  { label: 'Sulawesi Barat', value: 'sulawesi_barat_263' },
  { label: 'Sulawesi Selatan', value: 'sulawesi_selatan_36' },
  { label: 'Sulawesi Tengah', value: 'sulawesi_tengah_154' },
  { label: 'Sulawesi Tenggara', value: 'sulawesi_tenggara_81' },
  { label: 'Sulawesi Utara', value: 'sulawesi_utara_173' },
  { label: 'Sumatera Barat', value: 'sumatera_barat_16' },
  { label: 'Sumatera Selatan', value: 'sumatera_selatan_103' },
  { label: 'Sumatera Utara', value: 'sumatera_utara_27' },
];
const MAIN_PROCUREMENT_CATEGORY_OPTIONS = ['Goods', 'Services', 'Works'];

function Toast({ toasts }) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`px-4 py-3 rounded-lg shadow-lg text-sm font-medium text-white flex items-center gap-2 transition-all ${
            toast.type === 'error'
              ? 'bg-red-600'
              : toast.type === 'warn'
                ? 'bg-orange-500'
                : 'bg-gray-900'
          }`}
        >
          <span>{toast.type === 'error' ? 'x' : toast.type === 'warn' ? '!' : 'ok'}</span>
          {toast.msg}
        </div>
      ))}
    </div>
  );
}

function SettingsPanel({ open, onClose }) {
  const [settings, setSettings] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('auditOldSettings') || '{}');
    } catch {
      return {};
    }
  });
  const merged = {
    autoAnalysis: false,
    notificationEmail: '',
    ...settings,
  };

  const save = () => {
    localStorage.setItem('auditOldSettings', JSON.stringify(merged));
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6" onClick={(event) => event.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-gray-900">Audit Settings</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 text-xl">x</button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Notification Email</label>
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
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              defaultChecked={merged.autoAnalysis}
              onChange={(event) => {
                merged.autoAnalysis = event.target.checked;
              }}
              className="w-4 h-4"
            />
            <span className="text-sm text-gray-700">Auto-analyze after upload</span>
          </label>
        </div>
        <div className="mt-6 flex gap-3 justify-end">
          <button onClick={onClose} className="px-4 py-2 text-sm text-gray-500 hover:text-gray-800">Cancel</button>
          <button onClick={save} className="px-5 py-2 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-700">Save Settings</button>
        </div>
      </div>
    </div>
  );
}

function SearchableNamaDaerah({ value, onChange }) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const selected = NAMA_DAERAH_OPTIONS.find((option) => option.value === value);
    setQuery(selected ? selected.label : '');
  }, [value]);

  const filteredOptions = NAMA_DAERAH_OPTIONS.filter((option) => {
    const needle = query.trim().toLowerCase();
    if (!needle) return true;
    return option.label.toLowerCase().includes(needle) || option.value.toLowerCase().includes(needle);
  });

  const commitQuery = () => {
    const normalized = query.trim().toLowerCase();
    const matched = NAMA_DAERAH_OPTIONS.find(
      (option) => option.label.toLowerCase() === normalized || option.value.toLowerCase() === normalized
    );

    if (matched) {
      onChange(matched.value);
      setQuery(matched.label);
      return;
    }

    if (!normalized) {
      onChange('');
      setQuery('');
      return;
    }

    const selected = NAMA_DAERAH_OPTIONS.find((option) => option.value === value);
    setQuery(selected ? selected.label : '');
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
        placeholder="Search one of 34 provinces..."
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
      />
      {value && <p className="mt-1 text-xs text-gray-500">Model key: {value}</p>}
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
  const [tab, setTab] = useState('upload');
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzeResult, setAnalyzeResult] = useState(null);
  const [audits, setAudits] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [riskFilter, setRiskFilter] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [manualForm, setManualForm] = useState({
    tender_title: '',
    tender_minvalue: '',
    award_value: '',
    award_date: '',
    days_to_award: '',
    mainprocurementcategory: '',
    award_title: '',
    award_supplier: '',
    nama_daerah: '',
  });
  const [manualLoading, setManualLoading] = useState(false);
  const fileRef = useRef();
  const searchTimer = useRef();

  const toast = (msg, type = 'success') => {
    const id = Date.now();
    setToasts((current) => [...current, { id, msg, type }]);
    setTimeout(() => {
      setToasts((current) => current.filter((item) => item.id !== id));
    }, 4000);
  };

  const fetchAudits = useCallback(async (q = search, risk = riskFilter, currentPage = page) => {
    try {
      const params = new URLSearchParams({ page: currentPage, limit: 8 });
      if (q) params.set('q', q);
      if (risk) params.set('risk', risk);

      const response = await fetch(`${API}?${params}`);
      const data = await response.json();
      if (data.success) {
        setAudits(data.data);
        setTotal(data.total);
      }
    } catch {
      // ignore dashboard refresh failures
    }
  }, [page, riskFilter, search]);

  useEffect(() => {
    fetchAudits();
  }, [fetchAudits]);

  const handleFileSelect = (selectedFile) => {
    if (!selectedFile) return;

    const ext = selectedFile.name.split('.').pop().toLowerCase();
    if (!['xlsx', 'csv'].includes(ext)) {
      toast('Only .xlsx or .csv files are allowed', 'error');
      return;
    }
    if (selectedFile.size > 10 * 1024 * 1024) {
      toast('File too large. Maximum size is 10 MB.', 'error');
      return;
    }

    setFile(selectedFile);
    setUploadResult(null);
    setAnalyzeResult(null);
  };

  const handleUpload = async () => {
    if (!file) {
      toast('Please select a file first', 'warn');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${API}/upload`, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();

      if (!data.success) {
        toast(data.message || 'Upload failed', 'error');
        return;
      }

      setUploadResult(data);
      toast(`Uploaded ${data.rows} rows successfully`);

      const settings = JSON.parse(localStorage.getItem('auditOldSettings') || '{}');
      if (settings.autoAnalysis) {
        handleAnalyze(data.auditId);
      }
    } catch {
      toast('Network error during upload', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleAnalyze = async (overrideId) => {
    const auditId = overrideId || uploadResult?.auditId;
    if (!auditId) {
      toast('Upload a file first', 'warn');
      return;
    }

    setAnalyzing(true);
    try {
      const response = await fetch(`${API}/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ auditId }),
      });
      const data = await response.json();

      if (!data.success) {
        toast(data.message || 'Analysis failed', 'error');
        return;
      }

      setAnalyzeResult(data.summary);
      toast(`Analysis complete. ${data.total_processed} rows processed.`);
      fetchAudits();
    } catch {
      toast('Network error during analysis', 'error');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleManualSubmit = async () => {
    const missing = REQUIRED_COLUMNS.find((column) => !String(manualForm[column] || '').trim());
    if (missing) {
      toast(`${missing} is required`, 'warn');
      return;
    }

    const validNamaDaerah = NAMA_DAERAH_OPTIONS.some((option) => option.value === manualForm.nama_daerah);
    if (!validNamaDaerah) {
      toast('Please select a valid nama_daerah from the provided options', 'warn');
      return;
    }

    if (!MAIN_PROCUREMENT_CATEGORY_OPTIONS.includes(manualForm.mainprocurementcategory)) {
      toast('Please select a valid main procurement category', 'warn');
      return;
    }

    setManualLoading(true);
    try {
      const csvHeader = REQUIRED_COLUMNS.join(',');
      const csvRow = REQUIRED_COLUMNS.map((column) => {
        const value = String(manualForm[column] || '').replace(/"/g, '""');
        return `"${value}"`;
      }).join(',');

      const blob = new Blob([`${csvHeader}\n${csvRow}`], { type: 'text/csv' });
      const manualFile = new File([blob], 'manual_audit_old_entry.csv', { type: 'text/csv' });
      const formData = new FormData();
      formData.append('file', manualFile);
      formData.append('nama_daerah', manualForm.nama_daerah);

      const uploadResponse = await fetch(`${API}/upload`, {
        method: 'POST',
        body: formData,
      });
      const uploadData = await uploadResponse.json();

      if (!uploadData.success) {
        toast(uploadData.message || 'Upload failed', 'error');
        return;
      }

      setUploadResult(uploadData);
      toast('Manual entry uploaded');
      handleAnalyze(uploadData.auditId);
    } catch {
      toast('Network error', 'error');
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
      <Toast toasts={toasts} />
      <SettingsPanel open={showSettings} onClose={() => setShowSettings(false)} />

      <section className="pt-14">
        <div className="relative bg-gray-900 text-white overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_50%,rgba(20,50,90,0.5),transparent_60%)]" />
          <div className="relative z-10 max-w-7xl mx-auto px-6 py-14 grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-3xl font-bold mb-3 font-serif">Audit Prediction Workspace</h1>
              <p className="text-gray-300 text-sm leading-relaxed max-w-sm">
                Upload procurement rows that match the FastAPI model contract, then run anomaly prediction with FastAPI as the only prediction service.
              </p>
            </div>
            <div className="hidden md:flex justify-end gap-3">
              {analyzeResult && (
                <div className="bg-gray-800/70 border border-gray-700 rounded-xl p-4 text-xs space-y-2 min-w-[180px]">
                  <p className="text-gray-400 font-semibold uppercase tracking-wide">Prediction Summary</p>
                  <div className="flex items-center justify-between"><span className="text-red-400">High</span><span className="font-bold">{analyzeResult.high_risk}</span></div>
                  <div className="flex items-center justify-between"><span className="text-orange-400">Medium</span><span className="font-bold">{analyzeResult.medium_risk}</span></div>
                  <div className="flex items-center justify-between"><span className="text-emerald-400">Low</span><span className="font-bold">{analyzeResult.low_risk}</span></div>
                  <div className="border-t border-gray-700 pt-2 flex items-center justify-between text-gray-400"><span>Total</span><span className="font-bold text-white">{analyzeResult.total_processed}</span></div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          <div className="md:col-span-2 border border-gray-200 rounded-xl overflow-hidden">
            <div className="flex border-b border-gray-200">
              {['upload', 'manual'].map((currentTab) => (
                <button
                  key={currentTab}
                  onClick={() => setTab(currentTab)}
                  className={`px-5 py-3 text-sm font-medium uppercase tracking-wide transition-colors ${
                    tab === currentTab ? 'border-b-2 border-gray-900 text-gray-900' : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  {currentTab === 'upload' ? 'Upload File' : 'Manual Entry'}
                </button>
              ))}
            </div>

            <div className="p-6">
              {tab === 'upload' ? (
                <>
                  <div
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
                    onClick={() => fileRef.current.click()}
                    className={`border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center cursor-pointer transition-colors ${
                      dragging ? 'border-gray-400 bg-gray-50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      ref={fileRef}
                      type="file"
                      accept=".xlsx,.csv"
                      className="hidden"
                      onChange={(event) => handleFileSelect(event.target.files[0])}
                    />
                    <div className="text-3xl mb-4"><File /></div>
                    <p className="font-semibold text-gray-800 mb-1">Upload FastAPI-ready procurement data</p>
                    <p className="text-sm text-gray-500 mb-3">The spreadsheet must contain the exact columns required by the prediction service.</p>
                    <span className="text-xs text-gray-400 border border-gray-200 rounded px-2 py-1">.xlsx / .csv · max 10 MB</span>
                    {file && <p className="mt-3 text-xs text-emerald-600 font-medium">Selected: {file.name}</p>}
                  </div>

                  {uploadResult && !analyzeResult && (
                    <div className="mt-3 bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-3 text-sm text-emerald-700">
                      {uploadResult.rows} rows parsed from <strong>{uploadResult.filename}</strong>. Ready for FastAPI analysis.
                    </div>
                  )}

                  {analyzeResult && (
                    <div className="mt-3 bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 text-sm text-blue-700 flex flex-wrap gap-4">
                      <span>Prediction complete.</span>
                      <span className="text-red-600 font-semibold">High: {analyzeResult.high_risk}</span>
                      <span className="text-orange-500 font-semibold">Medium: {analyzeResult.medium_risk}</span>
                      <span className="text-emerald-600 font-semibold">Low: {analyzeResult.low_risk}</span>
                    </div>
                  )}

                  <div className="mt-4 flex flex-wrap gap-3 items-center justify-between">
                    <button onClick={() => fileRef.current.click()} className="bg-gray-900 text-white text-sm px-5 py-2.5 rounded-lg hover:bg-gray-700 transition-colors">
                      BROWSE FILES
                    </button>
                    <div className="flex gap-2">
                      <button
                        onClick={handleUpload}
                        disabled={!file || uploading}
                        className="bg-blue-600 text-white text-sm px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {uploading ? 'Uploading...' : 'Upload File'}
                      </button>
                      <button
                        onClick={() => handleAnalyze()}
                        disabled={!uploadResult || analyzing || !!analyzeResult}
                        className="bg-teal-600 text-white text-sm px-5 py-2.5 rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {analyzing ? 'Analyzing...' : 'Analyze with FastAPI'}
                      </button>
                    </div>
                  </div>
                  <div className="mt-2 text-right">
                    <button onClick={handleDownloadTemplate} className="text-xs text-gray-500 hover:text-gray-800 transition-colors">
                      Download Template Format
                    </button>
                  </div>
                </>
              ) : (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Nama Daerah *</label>
                    <SearchableNamaDaerah
                      value={manualForm.nama_daerah}
                      onChange={(nextValue) => setManualForm((current) => ({ ...current, nama_daerah: nextValue }))}
                    />
                  </div>
                  {[
                    { label: 'Tender Title *', key: 'tender_title', placeholder: 'Judul tender' },
                    { label: 'Tender Minimum Value *', key: 'tender_minvalue', type: 'number', placeholder: '1252306428.2' },
                    { label: 'Award Value *', key: 'award_value', type: 'number', placeholder: '1145627700' },
                    { label: 'Award Date *', key: 'award_date', type: 'date' },
                    { label: 'Days To Award *', key: 'days_to_award', type: 'number', placeholder: '11' },
                  ].map((field) => (
                    <div key={field.key}>
                      <label className="block text-xs text-gray-500 mb-1">{field.label}</label>
                      <input
                        type={field.type || 'text'}
                        placeholder={field.placeholder}
                        value={manualForm[field.key]}
                        onChange={(event) => setManualForm((current) => ({ ...current, [field.key]: event.target.value }))}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
                      />
                    </div>
                  ))}
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Main Procurement Category *</label>
                    <select
                      value={manualForm.mainprocurementcategory}
                      onChange={(event) => setManualForm((current) => ({ ...current, mainprocurementcategory: event.target.value }))}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gray-300"
                    >
                      <option value="">Select category</option>
                      {MAIN_PROCUREMENT_CATEGORY_OPTIONS.map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>
                  {[
                    { label: 'Award Title *', key: 'award_title', placeholder: 'Judul kontrak' },
                    { label: 'Award Supplier *', key: 'award_supplier', placeholder: 'Nama vendor pemenang' },
                  ].map((field) => (
                    <div key={field.key}>
                      <label className="block text-xs text-gray-500 mb-1">{field.label}</label>
                      <input
                        type="text"
                        placeholder={field.placeholder}
                        value={manualForm[field.key]}
                        onChange={(event) => setManualForm((current) => ({ ...current, [field.key]: event.target.value }))}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
                      />
                    </div>
                  ))}
                  <button
                    onClick={handleManualSubmit}
                    disabled={manualLoading}
                    className="w-full bg-gray-900 text-white text-sm py-2.5 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
                  >
                    {manualLoading ? 'Processing...' : 'Analyze Manual Row'}
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="border border-gray-200 rounded-xl p-5">
            <h3 className="font-semibold text-gray-900 mb-4 text-sm">FastAPI Contract</h3>
            <div className="mb-4">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Required Columns</p>
              <ul className="space-y-1.5">
                {REQUIRED_COLUMNS.map((field) => (
                  <li key={field} className="text-xs text-gray-600 flex gap-2"><span className="text-gray-300 mt-0.5">-</span>{field}</li>
                ))}
              </ul>
            </div>
            <div className="mb-4">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Prediction Output</p>
              <div className="space-y-2">
                {[
                  { label: 'score', desc: 'Raw anomaly score from FastAPI' },
                  { label: 'risk_level', desc: 'low / medium / high' },
                  { label: 'explanation', desc: 'Human-readable explanation from the model' },
                ].map((item) => (
                  <div key={item.label} className="rounded-lg border border-gray-200 p-3">
                    <p className="text-xs font-semibold text-gray-800">{item.label}</p>
                    <p className="text-xs text-gray-500 mt-1">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-500 leading-relaxed">
                Keep every uploaded row aligned with the FastAPI schema so the audit flow can send the same data without extra remapping.
              </p>
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
            <h2 className="text-xl font-bold text-gray-900 font-serif">Audit History</h2>
            <div className="flex items-center gap-2">
              <select
                value={riskFilter}
                onChange={(event) => handleRiskFilter(event.target.value)}
                className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none text-gray-600"
              >
                <option value="">All Risk</option>
                <option value="high">high</option>
                <option value="medium">medium</option>
                <option value="low">low</option>
              </select>
              <button onClick={() => setShowSearch((current) => !current)} className="text-gray-400 hover:text-gray-700 text-sm px-2 py-1.5 border border-gray-200 rounded-lg transition-colors" title="Search">Search</button>
              <button onClick={() => setShowSettings(true)} className="text-gray-400 hover:text-gray-700 text-sm px-2 py-1.5 border border-gray-200 rounded-lg transition-colors" title="Settings">Settings</button>
            </div>
          </div>

          {showSearch && (
            <div className="mb-4">
              <input
                type="text"
                value={search}
                onChange={(event) => handleSearch(event.target.value)}
                placeholder="Search by title, supplier, or nama_daerah..."
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
              />
            </div>
          )}

          <div className="border border-gray-200 rounded-xl overflow-hidden">
            {audits.length === 0 ? (
              <div className="py-16 text-center">
                <div className="text-4xl mb-3">Audit</div>
                <p className="text-gray-500 text-sm">No audit records found. Upload and analyze a file to get started.</p>
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    {['#', 'Filename', 'Rows', 'High', 'Medium', 'Low', 'Status', 'Date', 'Action'].map((header) => (
                      <th key={header} className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {audits.map((row, index) => (
                    <tr key={row.id} className={`border-b border-gray-50 hover:bg-gray-50 transition-colors ${index === audits.length - 1 ? 'border-0' : ''}`}>
                      <td className="px-4 py-3 text-sm font-medium text-blue-600">#{row.id}</td>
                      <td className="px-4 py-3 text-sm text-gray-700 max-w-[140px] truncate" title={row.filename}>{row.filename}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{row.total_rows}</td>
                      <td className="px-4 py-3 text-sm font-bold text-red-600">{row.high_risk}</td>
                      <td className="px-4 py-3 text-sm font-bold text-orange-500">{row.medium_risk}</td>
                      <td className="px-4 py-3 text-sm font-bold text-emerald-600">{row.low_risk}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded capitalize ${
                          row.status === 'completed'
                            ? 'bg-emerald-100 text-emerald-700'
                            : row.status === 'failed'
                              ? 'bg-red-100 text-red-700'
                              : row.status === 'processing'
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-gray-100 text-gray-600'
                        }`}
                        >
                          {row.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-500">{new Date(row.created_at).toLocaleDateString('id-ID')}</td>
                      <td className="px-4 py-3">
                        <button onClick={() => navigate(`/audit/${row.id}`)} className="text-sm text-teal-700 font-medium hover:text-teal-900 cursor-pointer whitespace-nowrap">
                          Detail Audit
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
                Prev
              </button>
              <span className="text-sm text-gray-500">Page {page} / {totalPages}</span>
              <button
                onClick={() => {
                  const nextPage = Math.min(totalPages, page + 1);
                  setPage(nextPage);
                  fetchAudits(search, riskFilter, nextPage);
                }}
                disabled={page === totalPages}
                className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
