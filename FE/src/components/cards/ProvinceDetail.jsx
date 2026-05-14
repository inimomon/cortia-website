import React, { useEffect, useState } from "react";
import axios from "axios";

const formatCurrency = (value) => {
  if (value === null || value === undefined || value === "") return "-";

  const num = Number(value || 0);

  if (num >= 1_000_000_000_000) {
    return `IDR ${(num / 1_000_000_000_000).toFixed(1)}T`;
  }

  if (num >= 1_000_000_000) {
    return `IDR ${(num / 1_000_000_000).toFixed(1)}B`;
  }

  if (num >= 1_000_000) {
    return `IDR ${(num / 1_000_000).toFixed(1)}M`;
  }

  return `IDR ${num}`;
};

const ProvinceDetail = ({ selected }) => {
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!selected?.name) {
      setDetail(null);
      return;
    }

    // ProvinceDetail.jsx
    console.log(
      "URL:",
      `${import.meta.env.VITE_BE_LINK}/prediction/stats/${encodeURIComponent(selected.name)}`,
    );
    const fetchDetail = async () => {
      try {
        setLoading(true);
        const daerah = encodeURIComponent(selected.name);

        const res = await axios.get(
          `${import.meta.env.VITE_BE_LINK}/prediction/stats/${daerah}`,
        );

        if (res.data.success) {
          setDetail(res.data.data);
        } else {
          setDetail(null);
        }
      } catch (err) {
        console.error("Gagal mengambil detail prediction:", err);
        setDetail(null);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [selected]);

  if (!selected) return null;

  const statusStyles = {
    DANGER: "bg-red-100 text-red-700",
    WARNING: "bg-orange-100 text-orange-700",
    SAFE: "bg-green-100 text-green-700",
  };

  const totalData = Number(detail?.total_data || 0);
  const danger = Number(detail?.danger || 0);
  const warning = Number(detail?.warning || 0);
  const safe = Number(detail?.safe || 0);

  const anomalyTypes = [
    {
      label: "Danger",
      value: danger,
      pct: totalData ? ((danger / totalData) * 100).toFixed(1) : null,
      color: "bg-red-500",
    },
    {
      label: "Warning",
      value: warning,
      pct: totalData ? ((warning / totalData) * 100).toFixed(1) : null,
      color: "bg-orange-400",
    },
    {
      label: "Safe",
      value: safe,
      pct: totalData ? ((safe / totalData) * 100).toFixed(1) : null,
      color: "bg-green-500",
    },
  ];

  return (
    <section className="border border-gray-200 rounded-xl p-6 mb-10 bg-white">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-bold text-gray-900 font-serif">
          Detail Anggaran: {selected?.name || "-"}
        </h2>

        <span
          className={`text-xs font-semibold px-2 py-1 rounded uppercase ${
            statusStyles[selected?.status] || "bg-gray-100 text-gray-700"
          }`}
        >
          STATUS: {selected?.status || "-"}
        </span>
      </div>

      {loading ? (
        <p className="text-sm text-gray-400">Memuat detail daerah...</p>
      ) : (
        <>
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div>
              <p className="text-xs text-gray-400">Total Anggaran</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(detail?.total_anggaran)}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-400">Total Data / Proyek</p>
              <p className="text-2xl font-bold text-gray-900">
                {totalData ? totalData.toLocaleString() : "-"}
              </p>
            </div>

            <div>
              <p className="text-xs text-red-500 font-medium">
                Anomali Terdeteksi ({danger ? danger.toLocaleString() : "-"}{" "}
                Kasus)
              </p>

              <p className="text-2xl font-bold text-red-600">
                {formatCurrency(detail?.total_gap)}
              </p>
            </div>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wide text-gray-400 mb-3">
              Sebaran Status Risiko
            </p>

            <div className="space-y-3">
              {anomalyTypes.map((b) => (
                <div key={b.label}>
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>
                      {b.label} ({b.value ? b.value.toLocaleString() : "-"})
                    </span>
                    <span>{b.pct ? `${b.pct}%` : "-"}</span>
                  </div>

                  <div className="h-2 bg-gray-100 rounded">
                    <div
                      className={`h-2 rounded ${b.color}`}
                      style={{ width: b.pct ? `${b.pct}%` : "0%" }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </section>
  );
};

export default ProvinceDetail;
