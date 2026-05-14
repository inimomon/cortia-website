import React from "react";

const RiskTable = ({ data, selected, setSelected, dotColor, skorColor }) => {
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm flex flex-col h-[450px]">
      <h3 className="font-semibold text-gray-800 p-4 border-b border-gray-100 bg-white">
        Daftar Risiko Wilayah
      </h3>

      <div className="overflow-y-auto flex-1 custom-scrollbar">
        <table className="w-full border-collapse">
          <thead className="sticky top-0 bg-gray-50 z-10 shadow-sm">
            <tr>
              <th className="text-left px-4 py-2 text-xs text-gray-400 font-medium border-b border-gray-100">
                Provinsi ({data.length})
              </th>
              <th className="text-right px-4 py-2 text-xs text-gray-400 font-medium border-b border-gray-100">
                Skor
              </th>
              <th className="text-right px-4 py-2 text-xs text-gray-400 font-medium border-b border-gray-100">
                Anomali
              </th>
            </tr>
          </thead>

          <tbody>
            {data.map((p) => (
              <tr
                key={p.name}
                onClick={() => setSelected(p)}
                className={`border-b border-gray-50 cursor-pointer transition-colors ${
                  selected?.name === p.name ? "bg-blue-50" : "hover:bg-gray-50"
                }`}
              >
                <td className="px-4 py-2.5 text-sm flex items-center gap-2">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: dotColor(p.status) }}
                  />
                  {p.name}
                </td>

                <td
                  className={`px-4 py-2.5 text-sm font-bold text-right ${skorColor(
                    p.skor,
                  )}`}
                >
                  {Number(p.skor || 0).toFixed(1)}
                </td>

                <td className="px-4 py-2.5 text-sm text-gray-600 text-right">
                  {(p.anomali || 0).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RiskTable;
