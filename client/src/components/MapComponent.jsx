import { useEffect, useState } from "react";
import axios from "axios";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";

import L from "leaflet";
import "leaflet/dist/leaflet.css";

// ===============================
// COLORED MARKERS
// ===============================

const pendingIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-yellow.png",
  iconRetinaUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-yellow.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const progressIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
  iconRetinaUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const resolvedIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
  iconRetinaUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

// ===============================
// AUTO FIT MAP
// ===============================

function FitBounds({ reports }) {
  const map = useMap();

  useEffect(() => {
    if (reports.length === 0) return;

    const bounds = reports.map((report) => [
      report.latitude,
      report.longitude,
    ]);

    map.fitBounds(bounds, {
      padding: [50, 50],
    });
  }, [reports, map]);

  return null;
}

function MapComponent() {
  const [reports, setReports] = useState([]);

  const center = [19.076, 72.8777];

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/reports/map"
      );

      setReports(res.data.reports);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <MapContainer
      center={center}
      zoom={11}
      scrollWheelZoom={true}
      style={{
        height: "500px",
        width: "100%",
        borderRadius: "12px",
      }}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <FitBounds reports={reports} />

      {reports.map((report) => (
        <Marker
          key={report._id}
          position={[report.latitude, report.longitude]}
          icon={
            report.status === "Resolved"
              ? resolvedIcon
              : report.status === "In Progress"
              ? progressIcon
              : pendingIcon
          }
        >
          <Popup>
            <div className="w-56">
              <h2 className="font-bold text-lg text-blue-700 mb-2">
                {report.damageType}
              </h2>

              <p>
                <strong>📍 Location:</strong>
                <br />
                {report.location}
              </p>

              <p className="mt-2">
                <strong>📊 Status:</strong> {report.status}
              </p>

              <p className="mt-2">
                <strong>📝 Description:</strong>
                <br />
                {report.description}
              </p>

              {report.image && (
                <img
                  src={`http://localhost:5000/uploads/${report.image}`}
                  alt="Road Damage"
                  className="mt-3 w-full h-36 object-cover rounded-lg"
                />
              )}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

export default MapComponent;