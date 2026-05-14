import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import indonesiaGeoJson from "../../data/indonesia-prov.json";
import axios from "axios";

const getRiskColor = (score) => {
  if (score >= 75) return "#ef4444";
  if (score >= 50) return "#facc15";
  return "#22c55e";
};

const getRiskLabel = (score) => {
  if (score >= 75) return "Critical";
  if (score >= 50) return "Warning";
  return "Safe";
};

const formatCurrency = (value) => {
  if (!value) return "Rp 0";

  if (value >= 1_000_000_000_000) {
    return `Rp ${(value / 1_000_000_000_000).toFixed(1)}T`;
  }

  if (value >= 1_000_000_000) {
    return `Rp ${(value / 1_000_000_000).toFixed(1)}B`;
  }

  if (value >= 1_000_000) {
    return `Rp ${(value / 1_000_000).toFixed(1)}M`;
  }

  return `Rp ${value}`;
};

const Map = () => {
  const [provinceRiskData, setProvinceRiskData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRiskMap = async () => {
      try {
        setLoading(true);

        const response = await axios.get("http://localhost:8123/api/risk-map");

        console.log("API RESPONSE:", response.data);

        const result = response.data;

        if (!result.success) {
          throw new Error("Failed fetch risk map");
        }

        const mappedData = {};

        result.data.forEach((item) => {
          mappedData[item.daerah?.toUpperCase()] = {
            riskScore: Number(item.index_resiko ?? 0),
            totalAlokasi: Number(item.total_alokasi ?? 0),
            kasusAktif: Number(item.count_danger ?? 0),
            totalData: Number(item.total_data ?? 0),
          };
        });

        console.log("MAPPED DATA:", mappedData);

        setProvinceRiskData(mappedData);
      } catch (err) {
        console.error("Fetch error:", err);

        if (err.response) {
          console.log("Response Error:", err.response.data);
        }

        if (err.request) {
          console.log("No response from backend");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRiskMap();
  }, []);

  const styleFeature = (feature) => {
    const name = (
      feature.properties.name || feature.properties.Propinsi
    )?.toUpperCase();

    const data = provinceRiskData[name];

    const score = data?.riskScore ?? 0;

    return {
      fillColor: getRiskColor(score),
      fillOpacity: 0.7,
      color: "#ffffff",
      weight: 1.5,
    };
  };

  const onEachFeature = (feature, layer) => {
    const name = (
      feature.properties.name || feature.properties.Propinsi
    )?.toUpperCase();

    const data = provinceRiskData[name];

    if (!data) return;

    const { riskScore, totalAlokasi, kasusAktif, totalData } = data;

    const riskLabel = getRiskLabel(riskScore);

    const riskColor =
      riskScore >= 75 ? "#ef4444" : riskScore >= 50 ? "#ca8a04" : "#16a34a";

    layer.bindTooltip(
      `
      <div style="font-family:sans-serif; min-width:180px; padding:4px">
        <p style="font-weight:700; font-size:14px; margin:0 0 8px">
          ${name}
        </p>

        <div style="display:flex; justify-content:space-between; font-size:12px; margin-bottom:4px">
          <span style="color:#6b7280">Indeks Risiko:</span>

          <span style="font-weight:700; color:${riskColor}">
            ${riskScore.toFixed(0)} — ${riskLabel}
          </span>
        </div>

        <div style="display:flex; justify-content:space-between; font-size:12px; margin-bottom:4px">
          <span style="color:#6b7280">Total Alokasi:</span>

          <span style="font-weight:600">
            ${formatCurrency(totalAlokasi)}
          </span>
        </div>

        <div style="display:flex; justify-content:space-between; font-size:12px; margin-bottom:4px">
          <span style="color:#6b7280">Kasus High Risk:</span>

          <span style="font-weight:600">
            ${kasusAktif}
          </span>
        </div>

        <div style="display:flex; justify-content:space-between; font-size:12px">
          <span style="color:#6b7280">Total Data:</span>

          <span style="font-weight:600">
            ${totalData}
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
          weight: 2.5,
        });
      },

      mouseout(e) {
        e.target.setStyle({
          fillOpacity: 0.7,
          weight: 1.5,
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
      maxBounds={[
        [-11, 94],
        [6, 142],
      ]}
      maxBoundsViscosity={0.8}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <GeoJSON
        key="indonesia"
        data={indonesiaGeoJson}
        style={styleFeature}
        onEachFeature={onEachFeature}
      />
    </MapContainer>
  );
};

export default Map;
