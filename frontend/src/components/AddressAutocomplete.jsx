import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import addressesFile from "../data/adrese.csv"; // ovde je tvoj CSV

export default function AddressAutocomplete({ label, value, onSelect }) {
  const [query, setQuery] = useState(value || "");
  const [suggestions, setSuggestions] = useState([]);
  const [addresses, setAddresses] = useState([]);

  useEffect(() => {
    // Učitavanje CSV fajla
    Papa.parse(addressesFile, {
      download: true,
      header: true,
      complete: (results) => {
        // Pretvaranje svih naziva u latinicu i filtriranje duplikata
        const unique = Array.from(
          new Set(results.data.map((row) => row.NAZIV_OPSTINE || row.GRAD))
        )
          .filter(Boolean)
          .map((name) => name.normalize("NFD").replace(/[\u0300-\u036f]/g, "")); // skidanje dijakritika
        setAddresses(unique);
      },
    });
  }, []);

  const handleChange = (e) => {
    const inputValue = e.target.value;
    setQuery(inputValue);

    if (inputValue.length > 1) {
      const filtered = addresses.filter((addr) =>
        addr.toLowerCase().startsWith(inputValue.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 5)); // max 5 predloga
    } else {
      setSuggestions([]);
    }
  };

  const handleSelect = (selected) => {
    setQuery(selected);
    setSuggestions([]);
    onSelect(selected); // prosleđuje vrednost parent komponenti
  };

  return (
    <div className="relative">
      <label className="block mb-1">{label}</label>
      <input
        type="text"
        value={query}
        onChange={handleChange}
        className="border p-2 w-full"
        placeholder="Unesite grad..."
      />
      {suggestions.length > 0 && (
        <ul className="absolute z-10 bg-white border w-full max-h-40 overflow-y-auto">
          {suggestions.map((s, idx) => (
            <li
              key={idx}
              onClick={() => handleSelect(s)}
              className="p-2 hover:bg-gray-200 cursor-pointer"
            >
              {s}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
