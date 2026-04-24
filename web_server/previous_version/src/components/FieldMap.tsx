import React, { useEffect, useRef, createElement } from "react";
import L from "leaflet";
export const FieldMap = () => {
  const mapRef = useRef(null);
  useEffect(() => {
    const linkElement = document.createElement("link");
    linkElement.rel = "stylesheet";
    linkElement.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    linkElement.integrity =
    "sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=";
    linkElement.crossOrigin = "";
    document.head.appendChild(linkElement);
    if (mapRef.current) {
      // Initialize the map
      const map = L.map(mapRef.current).setView([51.505, -0.09], 16);
      // Add tile layer (OpenStreetMap)
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);
      // Add field polygon (simulating a farm field)
      const fieldCoordinates = [
      [51.505, -0.09],
      [51.51, -0.1],
      [51.51, -0.08],
      [51.505, -0.07]];

      const field = L.polygon(fieldCoordinates, {
        color: "#4ade80",
        fillColor: "#86efac",
        fillOpacity: 0.5
      }).addTo(map);
      // Add crop row markers
      const cropRows = [
      {
        id: 1,
        position: [51.507, -0.09],
        status: "optimal"
      },
      {
        id: 2,
        position: [51.508, -0.088],
        status: "warning"
      },
      {
        id: 3,
        position: [51.509, -0.086],
        status: "optimal"
      },
      {
        id: 4,
        position: [51.507, -0.085],
        status: "danger"
      },
      {
        id: 5,
        position: [51.506, -0.083],
        status: "optimal"
      }];

      cropRows.forEach((row) => {
        let markerColor = "#22c55e"; // green for optimal
        if (row.status === "warning") markerColor = "#f59e0b"; // amber for warning
        if (row.status === "danger") markerColor = "#ef4444"; // red for danger
        const cropMarker = L.circleMarker(row.position, {
          radius: 8,
          fillColor: markerColor,
          color: "#ffffff",
          weight: 2,
          opacity: 1,
          fillOpacity: 0.8
        }).addTo(map);
        cropMarker.bindPopup(
          `<b>Crop Row ${row.id}</b><br>Status: ${row.status}`
        );
      });
      // Clean up on unmount
      return () => {
        map.remove();
        // Remove the dynamically added CSS when component unmounts
        document.head.removeChild(linkElement);
      };
    }
  }, [mapRef]);
  return <div ref={mapRef} className="h-full w-full rounded" />;
};