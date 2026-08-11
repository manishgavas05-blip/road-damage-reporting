import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
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
  // =====================================================
  // DEFAULT LOCATION: POWAI, MUMBAI
  // =====================================================
  const lat = Number(latitude) || 19.1197;
  const lng = Number(longitude) || 72.9051;

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
        center={[lat, lng]}
        zoom={15}

        // IMPORTANT:
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
            REPORT MARKER
        ================================================= */}
        <Marker position={[lat, lng]}>

          <Popup>

            <div className="text-sm text-[#374151] min-w-[150px]">

              <div className="flex items-center gap-2 mb-1">

                <span className="w-2 h-2 rounded-full bg-[#F4B400]"></span>

                <strong className="font-semibold text-[#374151]">
                  Reported Location
                </strong>

              </div>

              <p className="text-gray-600">
                {location || "Road damage location"}
              </p>

            </div>

          </Popup>

        </Marker>

      </MapContainer>

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