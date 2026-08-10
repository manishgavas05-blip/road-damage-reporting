import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet marker icon issue with Vite
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

function MapComponent({
  latitude,
  longitude,
  location,
  height = "500px",
}) {
  // Default location: Powai, Mumbai
  const lat = Number(latitude) || 19.1197;
  const lng = Number(longitude) || 72.9051;

  return (
    <div
      className="relative w-full overflow-hidden rounded-2xl border border-gray-200 shadow-md"
      style={{
        height,
        zIndex: 0,
      }}
    >
      <MapContainer
        center={[lat, lng]}
        zoom={15}
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
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker position={[lat, lng]}>
          <Popup>
            <div className="text-sm">
              <strong>Reported Location</strong>
              <br />
              {location || "Road damage location"}
            </div>
          </Popup>
        </Marker>
      </MapContainer>

      {/* Small instruction overlay */}
      <div
        className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm
                   px-3 py-2 rounded-lg shadow-md text-xs text-gray-600"
        style={{ zIndex: 500 }}
      >
        Double-click to zoom
      </div>
    </div>
  );
}

export default MapComponent;