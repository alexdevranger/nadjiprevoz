import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// default center of Serbia
const CENTER = [44.0, 20.5];

export default function MapView() {
  const mapRef = useRef(null);
  const [mapReady, setMapReady] = useState(false);
  const [markers, setMarkers] = useState([]);
  const polyRef = useRef(null);

  useEffect(() => {
    mapRef.current = L.map("map", { center: CENTER, zoom: 7 });
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(mapRef.current);

    mapRef.current.on("click", onMapClick);
    setMapReady(true);
    return () => mapRef.current.off("click", onMapClick);
  }, []);

  async function onMapClick(e) {
    const lat = e.latlng.lat;
    const lng = e.latlng.lng;

    // add marker
    const mk = L.marker([lat, lng]).addTo(mapRef.current);
    setMarkers((prev) => {
      const next = [...prev, { lat, lng, marker: mk }];

      // if we have two markers, request route
      if (next.length === 2) {
        requestRoute(next[0], next[1]);
      }
      return next.slice(-2); // keep last 2
    });
  }

  async function requestRoute(a, b) {
    // build start and end as "lng,lat"
    const start = `${a.lng},${a.lat}`;
    const end = `${b.lng},${b.lat}`;

    try {
      const resp = await fetch(
        `http://localhost:4000/api/route?start=${start}&end=${end}`
      );
      const data = await resp.json();
      if (data.error) return alert("Route error: " + data.error);

      // draw geometry on map
      const coords = data.geometry.coordinates.map((c) => [c[1], c[0]]);
      if (polyRef.current) mapRef.current.removeLayer(polyRef.current);
      polyRef.current = L.polyline(coords).addTo(mapRef.current);
      mapRef.current.fitBounds(polyRef.current.getBounds());

      const km = (data.distanceMeters / 1000).toFixed(2);
      const mins = Math.round(data.durationSec / 60);
      alert(`Rastojanje: ${km} km\nVreme: ~${mins} min`);
    } catch (err) {
      console.error(err);
      alert("Request failed");
    }
  }

  return (
    <div style={{ height: "80vh" }}>
      <div id="map" style={{ height: "100%" }}></div>
      <div style={{ padding: 8 }}>
        <small>
          Click map to set start and end. Distances calculated along roads
          (OSRM).
        </small>
      </div>
    </div>
  );
}
