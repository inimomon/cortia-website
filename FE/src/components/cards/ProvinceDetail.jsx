import React, { useEffect, useState } from "react";
import axios from "axios";

const formatCurrency = (value) => {
  if (value === null || value === undefined || value === "") return "-";

  const num = Number(value || 0);

  if (num >= 1_000_000_000_000) {
    return `IDR ${(num / 1_000_000_000_000).toFixed(1)}T`;
  }

  if (num >= 1_000_000_000) {
    return `IDR ${(num / 1_000_000_000).toFixed(1)}M`;
  }

  if (num >= 1_000_000) {
    return `IDR ${(num / 1_000_000).toFixed(1)}Jt`;
  }

  return `IDR ${num.toLocaleString("id-ID")}`;
};

const getSelectedName = (selected) => {
  return selected?.name || selected?.nama || selected?.daerah || "";
};

const getSelectedStatus = (selected, detail) => {
  return (
    selected?.status ||
    selected?.heatmapStatus ||
    selected?.heatmap_status ||
    detail?.status ||
    detail?.heatmap_status ||
    "-"
  );
};

const ProvinceDetail = ({ selected }) => {
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(false);

  const selectedName = getSelectedName(selected);

  useEffect(() => {
    if (!selectedName) {
      setDetail(null);
      return;
    }

    const fetchDetail = async () => {
      try {
        setLoading(true);

        const daerah = encodeURIComponent(selectedName);

        const res = await axios.get(
          `${import.meta.env.VITE_BE_LINK}/prediction/stats/${daerah}`
        );

        console.log("DETAIL RESPONSE:", res.data);

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
  }, [selectedName]);

  if (!selected) return null;

  const status = getSelectedStatus(selected, detail);

  const statusStyles = {
    KRITIS: "bg-red-100 text-red-700",
    WASPADA: "bg-orange-100 text-orange-700",
    AMAN: "bg-green-100 text-green-700",
  };

  const totalData = Number(detail?.total_data ?? selected?.totalData ?? 0);

  const danger = Number(
    detail?.danger ??
      detail?.count_danger ??
      selected?.anomali ??
      selected?.countDanger ??
      0,
  );

  const warning = Number(
    detail?.warning ??
      detail?.count_warning ??
      selected?.warning ??
      selected?.countWarning ??
      0,
  );

  const safe = Number(
    detail?.safe ??
      detail?.count_safe ??
      selected?.safe ??
      selected?.countSafe ??
      0,
  );

  const totalAnggaran =
    detail?.total_anggaran ??
    detail?.total_alokasi ??
    selected?.totalAlokasi ??
    0;

  const totalGap =
    detail?.total_gap ??
    detail?.gap_harga ??
    detail?.total_alokasi_final ??
    selected?.totalAlokasiFinal ??
    0;

  const anomalyTypes = [
    {
      label: "Kritis",
      value: danger,
      pct: totalData ? ((danger / totalData) * 100).toFixed(1) : null,
      color: "bg-red-500",
    },
    {
      label: "Waspada",
      value: warning,
      pct: totalData ? ((warning / totalData) * 100).toFixed(1) : null,
      color: "bg-orange-400",
    },
    {
      label: "Aman",
      value: safe,
      pct: totalData ? ((safe / totalData) * 100).toFixed(1) : null,
      color: "bg-green-500",
    },
  ];

  return (
    <section className="border border-gray-200 rounded-xl p-6 mb-10 bg-white">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-bold text-gray-900 font-serif">
          Detail Anggaran: {selectedName || "-"}
        </h2>

        <span
          className={`text-xs font-semibold px-2 py-1 rounded uppercase ${
            statusStyles[status] || "bg-gray-100 text-gray-700"
          }`}
        >
          STATUS: {status}
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
                {formatCurrency(totalAnggaran)}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-400">Total Data / Proyek</p>
              <p className="text-2xl font-bold text-gray-900">
                {totalData ? totalData.toLocaleString("id-ID") : "-"}
              </p>
            </div>

            <div>
              <p className="text-xs text-red-500 font-medium">
                Anomali Terdeteksi (
                {danger ? danger.toLocaleString("id-ID") : "-"} Kasus)
              </p>

              <p className="text-2xl font-bold text-red-600">
                {formatCurrency(totalGap)}
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
                      {b.label} (
                      {b.value ? b.value.toLocaleString("id-ID") : "-"})
                    </span>

                    <span>{b.pct ? `${b.pct}%` : "-"}</span>
                  </div>

                  <div className="h-2 bg-gray-100 rounded">
                    <div
                      className={`h-2 rounded ${b.color}`}
                      style={{
                        width: b.pct ? `${b.pct}%` : "0%",
                      }}
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