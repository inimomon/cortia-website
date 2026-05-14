import React, { useState, useRef } from 'react';
import { FileUp } from 'lucide-react';

const AuditUpload = () => {
  const [tab, setTab] = useState('upload');
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState(null);
  const fileRef = useRef(null);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="md:col-span-2 border border-gray-200 rounded-xl overflow-hidden bg-white">
      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        {['upload', 'manual'].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-3 text-sm font-medium uppercase tracking-wide transition-colors ${
              tab === t ? 'border-b-2 border-gray-900 text-gray-900' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            {t === 'upload' ? 'Unggah Data' : 'Input Manual'}
          </button>
        ))}
      </div>

      <div className="p-6">
        {tab === 'upload' ? (
          <>
            <div
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
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
                onChange={(e) => setFile(e.target.files[0])} 
              />
              <div className="text-3xl mb-2 text-gray-400"><FileUp /></div>
              <p className="font-semibold text-gray-800 mb-1">Secure Data Upload</p>
              <p className="text-sm text-gray-500 mb-3 text-center">
                Drag and drop your financial records here, or click to browse.
              </p>
              <span className="text-xs text-gray-400 border border-gray-200 rounded px-2 py-1 uppercase">
                .xlsx / .csv
              </span>
              {file && <p className="mt-3 text-xs text-green-600 font-medium italic">✔ {file.name}</p>}
            </div>
            
            <div className="mt-3 flex justify-between items-center">
              <button 
                onClick={() => fileRef.current.click()}
                className="bg-gray-900 text-white text-sm px-5 py-2.5 rounded hover:bg-gray-700 transition-colors mx-auto block uppercase tracking-wide font-medium"
              >
                BROWSE FILES
              </button>
            </div>
            
            <div className="mt-3 text-right">
              <button className="text-xs text-gray-400 hover:text-gray-800 transition-colors">
                ↓ Download Template Format
              </button>
            </div>
          </>
        ) : (
          <div className="space-y-4">
            {[
              { label: 'Transaction ID', placeholder: 'TX-XXXXXXXX' },
              { label: 'Date of Transaction', placeholder: 'YYYY-MM-DD' },
              { label: 'Amount', placeholder: 'e.g. 12400000000' },
              { label: 'Beneficiary Account / Entity', placeholder: 'Entity name' },
              { label: 'Department Code', placeholder: 'DEPT-XXXX' },
            ].map((f) => (
              <div key={f.label}>
                <label className="block text-xs text-gray-500 mb-1">{f.label}</label>
                <input
                  type="text"
                  placeholder={f.placeholder}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all"
                />
              </div>
            ))}
            <button className="w-full bg-gray-900 text-white text-sm py-3 rounded hover:bg-gray-700 transition-colors font-medium uppercase tracking-wide">
              Analisa Transaksi
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuditUpload;