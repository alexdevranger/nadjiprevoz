import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Link } from "react-router-dom";

const services = [
  {
    id: 1,
    name: "Auto Mehanicar Arandjelovac",
    type: "Mehanicar",
    lat: 44.4162,
    lng: 20.662,
    banner: "/images/mehanicar.jpg",
  },
  {
    id: 2,
    name: "Vulkanizer Beograd",
    type: "Vulkanizer",
    lat: 44.8206,
    lng: 20.462,
    banner: "/images/vulkanizer.jpg",
  },
];

export default function NearbyMap() {
  const mapRef = useRef(null);
  const [position, setPosition] = useState([44.8176, 20.4569]); // default
  const [accuracy, setAccuracy] = useState(0);

  useEffect(() => {
    // inicijalizacija mape
    mapRef.current = L.map("map", { center: position, zoom: 15 });
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(mapRef.current);

    // marker za korisnika
    const userMarker = L.marker(position)
      .addTo(mapRef.current)
      .bindPopup("Vaša trenutna lokacija");
    const userCircle = L.circle(position, { radius: 50, color: "blue" }).addTo(
      mapRef.current
    );

    // marker-i za servise
    services.forEach((s) => {
      const popupContent = `
        <div style="text-align:center">
          <img src="${s.banner}" alt="${s.name}" style="width:120px;height:60px;object-fit:cover;border-radius:6px"/>
          <div style="font-weight:bold;margin-top:4px">${s.name}</div>
          <div style="font-size:12px;color:#555">${s.type}</div>
          <a href="https://www.google.com/maps?q=${s.lat},${s.lng}" target="_blank" style="font-size:12px;color:blue;text-decoration:underline">Navigacija</a>
        </div>
      `;
      L.marker([s.lat, s.lng]).addTo(mapRef.current).bindPopup(popupContent);
    });

    // pokušaj geolokacije korisnika
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude, accuracy } = pos.coords;
          setPosition([latitude, longitude]);
          setAccuracy(accuracy);
          // update korisnikov marker i krug
          userMarker.setLatLng([latitude, longitude]);
          userCircle.setLatLng([latitude, longitude]);
        },
        (err) => console.error("Lokacija nije dostupna:", err),
        { enableHighAccuracy: true }
      );
    }

    return () => mapRef.current.remove(); // cleanup
  }, []);

  return (
    <div className="flex flex-col h-screen">
      <div className="flex justify-between items-center p-4 bg-blue-200 text-white">
        <h1 className="font-bold text-lg">Servisi u blizini</h1>
        <Link
          to="/all-services"
          className="bg-white text-blue-600 px-3 py-1 rounded hover:bg-gray-100 transition"
        >
          Prikaži sve
        </Link>
      </div>
      <div id="map" style={{ flex: 1 }} />
    </div>
  );
}
