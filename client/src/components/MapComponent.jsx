import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  CircleMarker,
  useMap,
} from "react-leaflet";

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.heat";

// =====================================================
// FIX LEAFLET MARKER ICON ISSUE WITH VITE
// =====================================================
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

// =====================================================
// PRIORITY SCORE CALCULATION
// =====================================================
const calculatePriority = (report) => {
  let score = 30;

  const damage = (report.damageType || "").toLowerCase();

  // Damage type contribution
  if (
    damage.includes("major") ||
    damage.includes("deep") ||
    damage.includes("severe") ||
    damage.includes("pothole")
  ) {
    score += 35;
  } else if (
    damage.includes("crack") ||
    damage.includes("broken") ||
    damage.includes("damaged")
  ) {
    score += 20;
  } else {
    score += 10;
  }

  // Unresolved age contribution
  if (report.createdAt) {
    const ageInDays =
      (Date.now() - new Date(report.createdAt).getTime()) /
      (1000 * 60 * 60 * 24);

    if (ageInDays >= 30) score += 25;
    else if (ageInDays >= 14) score += 18;
    else if (ageInDays >= 7) score += 12;
    else if (ageInDays >= 3) score += 6;
  }

  // Status contribution
  if (report.status === "Resolved") {
    score = 5;
  } else if (report.status === "In Progress") {
    score -= 15;
  }

  return Math.max(0, Math.min(100, score));
};

// =====================================================
// PRIORITY LABEL
// =====================================================
const getPriority = (score) => {
  if (score >= 80) {
    return {
      label: "Critical",
      color: "#DC2626",
    };
  }

  if (score >= 60) {
    return {
      label: "High",
      color: "#EA580C",
    };
  }

  if (score >= 35) {
    return {
      label: "Medium",
      color: "#F4B400",
    };
  }

  return {
    label: "Low",
    color: "#16A34A",
  };
};

// =====================================================
// CREATE PRIORITY MARKER ICON
// =====================================================
const createPriorityIcon = (color) =>
  L.divIcon({
    className: "",
    html: `
      <div style="
        width: 18px;
        height: 18px;
        background: ${color};
        border: 3px solid white;
        border-radius: 50%;
        box-shadow: 0 1px 6px rgba(0,0,0,0.5);
      "></div>
    `,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
  });

// =====================================================
// HEATMAP LAYER
// =====================================================
function HeatmapLayer({ reports }) {
  const map = useMap();

  useEffect(() => {
    if (!L.heatLayer) {
      console.error(
        "Leaflet.heat failed to load. Check your installation."
      );
      return;
    }

    const points = reports
      .filter(
        (report) =>
          Number.isFinite(Number(report.latitude)) &&
          Number.isFinite(Number(report.longitude))
      )
      .map((report) => {
        const score = calculatePriority(report);

        return [
          Number(report.latitude),
          Number(report.longitude),
          score / 100,
        ];
      });

    const heatLayer = L.heatLayer(points, {
      radius: 35,
      blur: 25,
      maxZoom: 17,
      minOpacity: 0.4,
      gradient: {
        0.2: "#16A34A",
        0.4: "#F4B400",
        0.6: "#EA580C",
        1.0: "#DC2626",
      },
    });

    heatLayer.addTo(map);

    return () => {
      map.removeLayer(heatLayer);
    };
  }, [map, reports]);

  return null;
}

// =====================================================
// MAP COMPONENT
// =====================================================
function MapComponent({
  latitude,
  longitude,
  location,
  height = "500px",
}) {
  const [reports, setReports] = useState([]);
  const [loadingReports, setLoadingReports] = useState(true);
  const [showHeatmap, setShowHeatmap] = useState(false);

  // =====================================================
  // DEFAULT LOCATION: POWAI, MUMBAI
  // =====================================================
  const defaultLat = Number(latitude) || 19.1197;
  const defaultLng = Number(longitude) || 72.9051;

  // =====================================================
  // FETCH COMMUNITY MAP REPORTS
  // =====================================================
  useEffect(() => {
    const fetchCommunityReports = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/reports/map"
        );

        const data = await response.json();

        if (response.ok && data.success) {
          const validReports = (data.reports || []).filter(
            (report) =>
              Number.isFinite(Number(report.latitude)) &&
              Number.isFinite(Number(report.longitude))
          );

          setReports(validReports);
        } else {
          console.error(
            "Failed to fetch map reports:",
            data.message || "Unknown error"
          );

          setReports([]);
        }
      } catch (error) {
        console.error("Error fetching map reports:", error);
        setReports([]);
      } finally {
        setLoadingReports(false);
      }
    };

    fetchCommunityReports();
  }, []);

  // =====================================================
  // MAP CENTER
  // =====================================================
  const firstReport = reports.length > 0 ? reports[0] : null;

  const mapLat = firstReport
    ? Number(firstReport.latitude)
    : defaultLat;

  const mapLng = firstReport
    ? Number(firstReport.longitude)
    : defaultLng;

  // =====================================================
  // TOTAL PRIORITY COUNTS
  // =====================================================
  const criticalCount = reports.filter(
    (report) => calculatePriority(report) >= 80
  ).length;

  const highCount = reports.filter((report) => {
    const score = calculatePriority(report);
    return score >= 60 && score < 80;
  }).length;

  return (
    <div
      className="relative w-full overflow-hidden rounded-xl border border-gray-200 bg-[#F4F5F6] shadow-sm"
      style={{ height, zIndex: 0 }}
    >
      {/* ================================================
          MAP
      ================================================ */}
      <MapContainer
        center={[mapLat, mapLng]}
        zoom={13}
        scrollWheelZoom={false}
        doubleClickZoom={true}
        dragging={true}
        touchZoom={true}
        zoomControl={true}
        className="w-full h-full"
        style={{
          height: "100%",
          width: "100%",
          zIndex: 0,
        }}
      >
        {/* OPENSTREETMAP */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* HEATMAP MODE */}
        {showHeatmap && <HeatmapLayer reports={reports} />}

        {/* REPORT MARKERS */}
        {!showHeatmap &&
          reports.map((report) => {
            const reportLat = Number(report.latitude);
            const reportLng = Number(report.longitude);

            const score = calculatePriority(report);
            const priority = getPriority(score);

            return (
              <Marker
                key={report._id}
                position={[reportLat, reportLng]}
                icon={createPriorityIcon(priority.color)}
              >
                <Popup>
                  <div className="min-w-[200px] text-sm text-[#374151]">
                    <div className="mb-2 flex items-center gap-2">
                      <span
                        className="h-3 w-3 rounded-full"
                        style={{
                          backgroundColor: priority.color,
                        }}
                      />

                      <strong className="font-semibold">
                        Road Damage Report
                      </strong>
                    </div>

                    {report.damageType && (
                      <p className="mb-1">
                        <strong>Damage:</strong>{" "}
                        {report.damageType}
                      </p>
                    )}

                    {report.location && (
                      <p className="mb-1 text-gray-600">
                        <strong>Location:</strong>{" "}
                        {report.location}
                      </p>
                    )}

                    {/* PRIORITY SCORE */}
                    <div className="my-2 rounded-md bg-gray-100 p-2">
                      <p>
                        <strong>Priority Score:</strong>{" "}
                        <span
                          style={{
                            color: priority.color,
                            fontWeight: "bold",
                          }}
                        >
                          {score}/100
                        </span>
                      </p>

                      <p>
                        <strong>Priority:</strong>{" "}
                        <span
                          style={{
                            color: priority.color,
                            fontWeight: "bold",
                          }}
                        >
                          {priority.label}
                        </span>
                      </p>
                    </div>

                    {/* STATUS */}
                    {report.status && (
                      <p className="mb-1">
                        <strong>Status:</strong>{" "}
                        <span
                          className={
                            report.status === "Resolved"
                              ? "font-semibold text-emerald-600"
                              : report.status === "In Progress"
                              ? "font-semibold text-amber-600"
                              : "font-semibold text-gray-600"
                          }
                        >
                          {report.status}
                        </span>
                      </p>
                    )}

                    {report.description && (
                      <p className="mt-2 text-gray-600">
                        {report.description}
                      </p>
                    )}
                  </div>
                </Popup>
              </Marker>
            );
          })}

        {/* FALLBACK MARKER */}
        {!loadingReports && reports.length === 0 && (
          <Marker position={[defaultLat, defaultLng]}>
            <Popup>
              <div className="min-w-[150px] text-sm text-[#374151]">
                <strong>Reported Location</strong>
                <p className="text-gray-600">
                  {location || "Road damage location"}
                </p>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>

      {/* ================================================
          TOP LEFT REPORT COUNT
      ================================================ */}
      {!loadingReports && (
        <div
          className="absolute left-3 top-3 rounded-lg border border-gray-200 bg-white/95 px-3 py-2 text-xs font-semibold text-[#374151] shadow-md"
          style={{ zIndex: 500 }}
        >
          📍 {reports.length} Community{" "}
          {reports.length === 1 ? "Report" : "Reports"}
        </div>
      )}

      {/* ================================================
          HEATMAP TOGGLE
      ================================================ */}
      <button
        type="button"
        onClick={() => setShowHeatmap((prev) => !prev)}
        className="absolute right-3 top-3 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-[#374151] shadow-md transition hover:bg-gray-100"
        style={{ zIndex: 500 }}
      >
        {showHeatmap ? "📍 Show Markers" : "🔥 Show Heatmap"}
      </button>

      {/* ================================================
          PRIORITY SUMMARY
      ================================================ */}
      {!loadingReports && reports.length > 0 && (
        <div
          className="absolute left-3 top-14 rounded-lg border border-gray-200 bg-white/95 px-3 py-2 text-xs text-[#374151] shadow-md"
          style={{ zIndex: 500 }}
        >
          <p className="mb-1 font-bold">Priority Overview</p>

          <p className="font-semibold text-red-600">
            Critical: {criticalCount}
          </p>

          <p className="font-semibold text-orange-600">
            High: {highCount}
          </p>
        </div>
      )}

      {/* ================================================
          LOADING INDICATOR
      ================================================ */}
      {loadingReports && (
        <div
          className="absolute left-3 top-3 flex items-center gap-2 rounded-lg border border-gray-200 bg-white/95 px-3 py-2 text-xs text-[#66727D] shadow-md"
          style={{ zIndex: 500 }}
        >
          <span className="h-3 w-3 animate-spin rounded-full border-2 border-gray-300 border-t-[#F4B400]" />
          <span>Loading community reports...</span>
        </div>
      )}

      {/* ================================================
          MAP INSTRUCTION
      ================================================ */}
      <div
        className="absolute bottom-3 left-3 flex items-center gap-2 rounded-lg border border-gray-200 bg-white/95 px-3 py-2 text-xs text-[#66727D] shadow-md"
        style={{ zIndex: 500 }}
      >
        <span className="font-bold text-[#F4B400]">⤢</span>
        <span>Double-click to zoom</span>
      </div>
    </div>
  );
}

export default MapComponent;