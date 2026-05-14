import React from 'react';
import { Settings, Search } from 'lucide-react';

const AuditHistoryTable = ({ auditHistory, skorColor, statusConfig }) => {
  return (
    <div className="bg-white">
      {/* Table Header with Actions */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-bold text-gray-900 font-serif">
          Riwayat Audit Terakhir
        </h2>
        <div className="flex gap-3">
          <button className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-50 rounded-md transition-colors">
            <Settings size={18} />
          </button>
          <button className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-50 rounded-md transition-colors">
            <Search size={18} />
          </button>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                {[
                  'ID Transaksi', 
                  'Entitas Sumber', 
                  'Nilai Kontrak', 
                  'Skor Risiko AI', 
                  'Status', 
                  'Tindakan'
                ].map((h) => (
                  <th 
                    key={h} 
                    className="text-left px-5 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {auditHistory.map((row) => (
                <tr 
                  key={row.id} 
                  className="hover:bg-slate-50/50 transition-colors group"
                >
                  <td className="px-5 py-4 text-sm font-bold text-blue-600 font-mono">
                    #{row.id}
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-700 font-medium">
                    {row.entity}
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-600">
                    {row.nilai}
                  </td>
                  <td className="px-5 py-4 text-sm font-black">
                    <span className={skorColor(row.skor)}>{row.skor}/100</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-[10px] font-black px-2 py-1 rounded-sm uppercase tracking-tighter ${statusConfig[row.status]}`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-sm text-teal-700 font-bold hover:text-teal-900 cursor-pointer transition-colors">
                    <div className="flex items-center gap-1">
                      Detail Audit 
                      <span className="group-hover:translate-x-1 transition-transform">›</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AuditHistoryTable;