import React, { useState, useEffect } from "react";
import axios from "axios";

export default function LocationInput({ label, name, value, onSelect }) {
  const [query, setQuery] = useState(value || "");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    if (!query || query.length < 2) {
      setSuggestions([]);
      return;
    }

    // const delayDebounce = setTimeout(() => {
    //   axios
    //     .get("https://nominatim.openstreetmap.org/search", {
    //       params: {
    //         q: query,
    //         format: "json",
    //         addressdetails: 1,
    //         countrycodes: "rs", // samo Srbija
    //         "accept-language": "sr-Latn", // latinica
    //         limit: 8,
    //       },
    //       headers: { "User-Agent": "TvojApp/1.0" },
    //     })
    //     .then((res) => {
    //       const filtered = (res.data || []).filter((place) => {
    //         const cls = place.class;
    //         const type = place.type;

    //         if (query.length <= 3) {
    //           // Kratak upit → samo gradovi
    //           return cls === "place" && (type === "city" || type === "town");
    //         }

    //         // Duži upit → dozvoljeni gradovi, ulice, adrese
    //         return (
    //           (cls === "place" && ["city", "town", "village"].includes(type)) ||
    //           cls === "highway" ||
    //           cls === "boundary" ||
    //           cls === "building"
    //         );
    //       });
    //       setSuggestions(filtered);
    //       setShowSuggestions(true);
    //     })

    //     .catch((err) => {
    //       console.error("Greška pri pretrazi lokacije:", err);
    //       setSuggestions([]);
    //     });
    // }, 300);

    // return () => clearTimeout(delayDebounce);
  }, [query]);

  const handleSelect = (place) => {
    let label = place.display_name;

    if (place.type === "city" || place.type === "town") {
      label = place.name; // samo ime grada
    }

    setQuery(label);
    setShowSuggestions(false);
    onSelect(label); // ovde će u bazu ući samo "Niš"
  };

  return (
    <div className="relative w-full">
      {label && <label className="block mb-1">{label}</label>}
      <input
        type="text"
        name={name}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setShowSuggestions(true)}
        placeholder="Unesite grad ili adresu..."
        className="border p-2 w-full"
        autoComplete="off"
      />
      {showSuggestions && suggestions.length > 0 && (
        <ul className="absolute z-10 bg-white border w-full max-h-48 overflow-y-auto shadow">
          {suggestions.map((sug, idx) => (
            <li
              key={idx}
              onClick={() => handleSelect(sug)}
              className="p-2 cursor-pointer hover:bg-gray-100"
            >
              {sug.display_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
