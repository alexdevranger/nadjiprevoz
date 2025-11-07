import React, { useState } from "react";
import { Link } from "react-router-dom";

const services = [
  {
    id: 1,
    name: "Auto Mehanicar Arandjelovac",
    type: "Mehanicar",
    city: "Arandjelovac",
    banner: "/images/mehanicar.jpg",
  },
  {
    id: 2,
    name: "Vulkanizer Beograd",
    type: "Vulkanizer",
    city: "Beograd",
    banner: "/images/vulkanizer.jpg",
  },
  {
    id: 3,
    name: "Električar Niš",
    type: "Električar",
    city: "Niš",
    banner: "/images/elektricar.jpg",
  },
];

const AllServices = () => {
  const [filterCity, setFilterCity] = useState("");

  const filtered = services.filter((s) =>
    filterCity ? s.city.toLowerCase().includes(filterCity.toLowerCase()) : true
  );

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Svi servisi</h1>
        <Link
          to="/nearby-map"
          className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
        >
          Prikaži mapu
        </Link>
      </div>

      <input
        type="text"
        placeholder="Pretraži po gradu..."
        value={filterCity}
        onChange={(e) => setFilterCity(e.target.value)}
        className="border rounded px-3 py-1 mb-4 w-full max-w-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {filtered.length === 0 && (
          <p className="text-gray-500">Nema servisa u ovom gradu.</p>
        )}
        {filtered.map((s) => (
          <div
            key={s.id}
            className="bg-white rounded-xl shadow overflow-hidden"
          >
            <img
              src={s.banner}
              alt={s.name}
              className="w-full h-40 object-cover"
            />
            <div className="p-3 flex flex-col gap-1">
              <span className="font-semibold">{s.name}</span>
              <span className="text-sm text-gray-600">{s.type}</span>
              <span className="text-sm text-gray-600">{s.city}</span>
              <a
                href={`https://www.google.com/maps?q=${s.lat},${s.lng}`}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 text-sm hover:underline"
              >
                Navigacija
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllServices;
