import { useEffect } from "react";
import { MapContainer, TileLayer, CircleMarker, Polygon, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const FIELD_BOUNDARY = [
  [42.2275, -71.2625],
  [42.2275, -71.2590],
  [42.2240, -71.2590],
  [42.2240, -71.2625],
];

const statusColor = (status) => {
  if (status === "Low")  return { color: "#d97706", fillColor: "#fbbf24" };
  if (status === "High") return { color: "#dc2626", fillColor: "#f87171" };
  return { color: "#16a34a", fillColor: "#4ade80" };
};

export const FieldMap = ({ locations, sensorData }) => {
  const center = [42.225562, -71.260312];

  const latestByLocation = sensorData.reduce((acc, row) => {
    if (!acc[row.location_id]) acc[row.location_id] = row;
    return acc;
  }, {});

  // Fix Leaflet icon warnings in CRA
  useEffect(() => {
    delete window.L?.Icon?.Default?.prototype?._getIconUrl;
  }, []);

  return (
    <div className="h-80 rounded-xl overflow-hidden border border-gray-200 shadow-sm">
      <MapContainer center={center} zoom={16} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Field boundary polygon */}
        <Polygon
          positions={FIELD_BOUNDARY}
          pathOptions={{ color: "#16a34a", fillColor: "#dcfce7", fillOpacity: 0.3, weight: 2 }}
        />

        {/* Location markers */}
        {locations.map((loc) => {
          if (!loc.latitude || !loc.longitude) return null;
          const latest = latestByLocation[loc.id];
          const colors = statusColor(latest?.status);
          return (
            <CircleMarker
              key={loc.id}
              center={[loc.latitude, loc.longitude]}
              radius={10}
              pathOptions={{ color: colors.color, fillColor: colors.fillColor, fillOpacity: 0.8, weight: 2 }}
            >
              <Popup>
                <div className="text-sm space-y-1 min-w-[160px]">
                  <p className="font-semibold text-gray-800">{loc.name}</p>
                  <p className="text-gray-400 text-xs">{loc.crop_type} · {loc.area_size} ha</p>
                  {latest && (
                    <>
                      <hr />
                      <p>🌡 {parseFloat(latest.temperature).toFixed(1)}°C</p>
                      <p>💧 {parseFloat(latest.soil_moisture).toFixed(1)}%</p>
                      <p>💨 {parseFloat(latest.humidity).toFixed(1)}%</p>
                      <p>⚗️ pH {parseFloat(latest.ph_level).toFixed(1)}</p>
                      <p className={`font-medium ${latest.status === "Normal" ? "text-green-600" : latest.status === "Low" ? "text-yellow-600" : "text-red-600"}`}>
                        ● {latest.status}
                      </p>
                    </>
                  )}
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
};
