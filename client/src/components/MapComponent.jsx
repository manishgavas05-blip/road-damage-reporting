import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

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

  // =====================================================
  // DEFAULT LOCATION: POWAI, MUMBAI
  // =====================================================
  const defaultLat = Number(latitude) || 19.1197;
  const defaultLng = Number(longitude) || 72.9051;

  // =====================================================
  // FETCH ALL COMMUNITY REPORTS
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
        console.error(
          "Error fetching community reports for map:",
          error
        );

        setReports([]);
      } finally {
        setLoadingReports(false);
      }
    };

    fetchCommunityReports();
  }, []);

  // =====================================================
  // DETERMINE MAP CENTER
  // =====================================================
  const firstReport = reports.length > 0 ? reports[0] : null;

  const mapLat = firstReport
    ? Number(firstReport.latitude)
    : defaultLat;

  const mapLng = firstReport
    ? Number(firstReport.longitude)
    : defaultLng;

  return (
    <div
      className="
        relative
        w-full
        overflow-hidden
        rounded-xl
        border
        border-gray-200
        bg-[#F4F5F6]
        shadow-sm
      "
      style={{
        height,
        zIndex: 0,
      }}
    >

      {/* =================================================
          MAP
      ================================================= */}
      <MapContainer
        center={[mapLat, mapLng]}
        zoom={13}

        // Mouse-wheel scrolling DOES NOT zoom the map.
        scrollWheelZoom={false}

        // Double-click DOES zoom the map.
        doubleClickZoom={true}

        // Normal map dragging remains enabled.
        dragging={true}

        // Touch zoom remains enabled.
        touchZoom={true}

        // Leaflet zoom buttons remain enabled.
        zoomControl={true}

        className="w-full h-full"

        style={{
          height: "100%",
          width: "100%",
          zIndex: 0,
        }}
      >

        {/* =================================================
            OPENSTREETMAP
        ================================================= */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* =================================================
            ALL COMMUNITY REPORT MARKERS
        ================================================= */}
        {reports.map((report) => {
          const reportLat = Number(report.latitude);
          const reportLng = Number(report.longitude);

          return (
            <Marker
              key={report._id}
              position={[reportLat, reportLng]}
            >
              <Popup>

                <div className="text-sm text-[#374151] min-w-[190px]">

                  {/* Header */}
                  <div className="flex items-center gap-2 mb-2">

                    <span className="w-2.5 h-2.5 rounded-full bg-[#F4B400]" />

                    <strong className="font-semibold text-[#374151]">
                      Road Damage Report
                    </strong>

                  </div>

                  {/* Damage Type */}
                  {report.damageType && (
                    <p className="mb-1">
                      <strong>Damage:</strong>{" "}
                      {report.damageType}
                    </p>
                  )}

                  {/* Location */}
                  {report.location && (
                    <p className="mb-1 text-gray-600">
                      <strong>Location:</strong>{" "}
                      {report.location}
                    </p>
                  )}

                  {/* Status */}
                  {report.status && (
                    <p className="mb-1">
                      <strong>Status:</strong>{" "}
                      <span
                        className={
                          report.status === "Resolved"
                            ? "text-emerald-600 font-semibold"
                            : report.status === "In Progress"
                            ? "text-amber-600 font-semibold"
                            : "text-gray-600 font-semibold"
                        }
                      >
                        {report.status}
                      </span>
                    </p>
                  )}

                  {/* Description */}
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

        {/* =================================================
            FALLBACK MARKER
            Only shown when there are no community reports.
        ================================================= */}
        {!loadingReports && reports.length === 0 && (
          <Marker position={[defaultLat, defaultLng]}>
            <Popup>

              <div className="text-sm text-[#374151] min-w-[150px]">

                <div className="flex items-center gap-2 mb-1">

                  <span className="w-2 h-2 rounded-full bg-[#F4B400]" />

                  <strong className="font-semibold">
                    Reported Location
                  </strong>

                </div>

                <p className="text-gray-600">
                  {location || "Road damage location"}
                </p>

              </div>

            </Popup>
          </Marker>
        )}

      </MapContainer>

      {/* =================================================
          REPORT COUNT
      ================================================= */}
      {!loadingReports && reports.length > 0 && (
        <div
          className="
            absolute
            top-3
            left-3
            bg-white/95
            backdrop-blur-sm
            px-3
            py-2
            rounded-lg
            shadow-md
            border
            border-gray-200
            text-xs
            text-[#374151]
            font-semibold
          "
          style={{
            zIndex: 500,
          }}
        >
          📍 {reports.length} Community{" "}
          {reports.length === 1 ? "Report" : "Reports"}
        </div>
      )}

      {/* =================================================
          LOADING INDICATOR
      ================================================= */}
      {loadingReports && (
        <div
          className="
            absolute
            top-3
            left-3
            bg-white/95
            backdrop-blur-sm
            px-3
            py-2
            rounded-lg
            shadow-md
            border
            border-gray-200
            text-xs
            text-[#66727D]
            flex
            items-center
            gap-2
          "
          style={{
            zIndex: 500,
          }}
        >
          <span className="w-3 h-3 border-2 border-gray-300 border-t-[#F4B400] rounded-full animate-spin" />

          <span>
            Loading community reports...
          </span>
        </div>
      )}

      {/* =================================================
          MAP INSTRUCTION
      ================================================= */}
      <div
        className="
          absolute
          bottom-3
          left-3
          bg-white/95
          backdrop-blur-sm
          px-3
          py-2
          rounded-lg
          shadow-md
          border
          border-gray-200
          text-xs
          text-[#66727D]
          flex
          items-center
          gap-2
        "
        style={{
          zIndex: 500,
        }}
      >
        <span className="text-[#F4B400] font-bold">
          ⤢
        </span>

        <span>
          Double-click to zoom
        </span>
      </div>

    </div>
  );
}

export default MapComponent;