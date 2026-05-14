import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import indonesiaGeoJson from "../../data/indonesia-prov.json";
import axios from "axios";

const normalizeProvinceName = (name) => {
  if (!name) return "";

  let upper = name.toUpperCase().trim().replace(/\./g, "").replace(/\s+/g, " ");

  if (upper.includes("ACEH")) return "ACEH";
  if (upper.includes("JAKARTA")) return "DKI JAKARTA";
  if (upper.includes("YOGYAKARTA")) return "DAERAH ISTIMEWA YOGYAKARTA";
  if (upper.includes("BANGKA")) return "KEPULAUAN BANGKA BELITUNG";
  if (upper.includes("KEPULAUAN RIAU") || upper === "KEP RIAU")
    return "KEPULAUAN RIAU";
  if (upper === "NTB") return "NUSA TENGGARA BARAT";
  if (upper === "NTT") return "NUSA TENGGARA TIMUR";

  return upper;
};
const formatCurrency = (value) => {
  const number = Number(value || 0);

  if (number >= 1_000_000_000_000) {
    return `Rp ${(number / 1_000_000_000_000).toFixed(1)}T`;
  }

  if (number >= 1_000_000_000) {
    return `Rp ${(number / 1_000_000_000).toFixed(1)}B`;
  }

  if (number >= 1_000_000) {
    return `Rp ${(number / 1_000_000).toFixed(1)}M`;
  }

  return `Rp ${number}`;
};

const getColor = (status) => {
  switch (status) {
    case "DANGER":
      return "#ef4444";

    case "WARNING":
      return "#facc15";

    case "SAFE":
      return "#22c55e";

    default:
      return "#d1d5db";
  }
};
const Map = () => {
  const [provinceRiskData, setProvinceRiskData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRiskMap = async () => {
      try {
        setLoading(true);

        const response = await axios.get(
          "http://localhost:8001/api/v1/riskMap",
        );

        const result = response.data;

        if (!result.success) {
          throw new Error("Failed fetch risk map");
        }

        const mappedData = {};

        result.data.forEach((item) => {
          const key = normalizeProvinceName(item.daerah);

          mappedData[key] = {
            nama: item.daerah,
            riskScore: Number(item.index_resiko ?? 0),
            totalAlokasi: Number(item.total_alokasi ?? 0),
            totalAlokasiFinal: Number(item.total_alokasi_final ?? 0),
            countDanger: Number(item.count_danger ?? 0),
            countWarning: Number(item.count_warning ?? 0),
            countSafe: Number(item.count_safe ?? 0),
            totalData: Number(item.total_data ?? 0),
            heatmapStatus: item.heatmap_status,
            heatmapColor: item.heatmap_color,
          };
        });

        console.log("DATA API:", mappedData);

        setProvinceRiskData(mappedData);
      } catch (err) {
        console.error("Fetch risk map error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRiskMap();
  }, []);

  const getProvinceNameFromGeoJson = (feature) => {
    return normalizeProvinceName(
      feature.properties.name ||
        feature.properties.Propinsi ||
        feature.properties.PROVINSI ||
        feature.properties.provinsi ||
        feature.properties.NAME_1,
    );
  };

  const styleFeature = (feature) => {
    const name = getProvinceNameFromGeoJson(feature);
    const data = provinceRiskData[name];

    if (!data) {
      console.log("Tidak cocok:", name);
    }

    return {
      fillColor: getColor(data?.heatmapStatus),
      fillOpacity: data ? 0.85 : 0.25,
      color: "#ffffff",
      weight: 1.2,
    };
  };

  const onEachFeature = (feature, layer) => {
    const name = getProvinceNameFromGeoJson(feature);
    const data = provinceRiskData[name];

    if (!data) {
      layer.bindTooltip(
        `
        <div style="font-family:sans-serif; padding:6px">
          <b>${name}</b><br/>
          <span style="font-size:12px; color:#ef4444">
            Data tidak ditemukan
          </span>
        </div>
        `,
        {
          sticky: true,
          opacity: 1,
        },
      );

      return;
    }

    const riskColor = getColor(data.heatmapStatus);

    layer.bindTooltip(
      `
      <div style="font-family:sans-serif; min-width:210px; padding:6px">

        <p style="font-weight:700; font-size:14px; margin:0 0 8px">
          ${data.nama}
        </p>

        <div style="display:flex; justify-content:space-between; font-size:12px; margin-bottom:4px">
          <span style="color:#6b7280">Status:</span>
          <span style="font-weight:700; color:${riskColor}">
            ${data.heatmapStatus}
          </span>
        </div>

        <div style="display:flex; justify-content:space-between; font-size:12px; margin-bottom:4px">
          <span style="color:#6b7280">Index Risiko:</span>
          <span style="font-weight:700">
            ${data.riskScore.toFixed(2)}
          </span>
        </div>

        <hr style="margin:6px 0"/>

        <div style="display:flex; justify-content:space-between; font-size:12px; margin-bottom:4px">
          <span style="color:#6b7280">Danger:</span>
          <span style="font-weight:600">${data.countDanger}</span>
        </div>

        <div style="display:flex; justify-content:space-between; font-size:12px; margin-bottom:4px">
          <span style="color:#6b7280">Warning:</span>
          <span style="font-weight:600">${data.countWarning}</span>
        </div>

        <div style="display:flex; justify-content:space-between; font-size:12px; margin-bottom:4px">
          <span style="color:#6b7280">Safe:</span>
          <span style="font-weight:600">${data.countSafe}</span>
        </div>

        <div style="display:flex; justify-content:space-between; font-size:12px; margin-bottom:4px">
          <span style="color:#6b7280">Total Data:</span>
          <span style="font-weight:600">${data.totalData}</span>
        </div>

        <hr style="margin:6px 0"/>

        <div style="display:flex; justify-content:space-between; font-size:12px; margin-bottom:4px">
          <span style="color:#6b7280">Total Alokasi:</span>
          <span style="font-weight:600">
            ${formatCurrency(data.totalAlokasi)}
          </span>
        </div>

        <div style="display:flex; justify-content:space-between; font-size:12px">
          <span style="color:#6b7280">Alokasi Final:</span>
          <span style="font-weight:600">
            ${formatCurrency(data.totalAlokasiFinal)}
          </span>
        </div>

      </div>
      `,
      {
        sticky: true,
        opacity: 1,
      },
    );

    layer.on({
      mouseover(e) {
        e.target.setStyle({
          fillOpacity: 1,
          weight: 2,
        });
      },

      mouseout(e) {
        e.target.setStyle({
          fillOpacity: 0.85,
          weight: 1.2,
        });
      },
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        Loading map...
      </div>
    );
  }

  return (
    <MapContainer
      center={[-2.5489, 118.0149]}
      zoom={4}
      minZoom={4}
      maxZoom={7}
      scrollWheelZoom={true}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <GeoJSON
        key={JSON.stringify(Object.keys(provinceRiskData))}
        data={indonesiaGeoJson}
        style={styleFeature}
        onEachFeature={onEachFeature}
      />
    </MapContainer>
  );
};

export default Map;
