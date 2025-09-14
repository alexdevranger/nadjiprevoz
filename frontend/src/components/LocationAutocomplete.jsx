// import React, { useState, useEffect } from "react";
// import GooglePlacesAutocomplete from "react-google-places-autocomplete";

// function LocationAutocomplete({ label, onSelect }) {
//   const [selected, setSelected] = useState(null);

//   const getLatLng = (place) => {
//     if (!place || !window.google) return;

//     const placeId = place.value.place_id;
//     const service = new window.google.maps.places.PlacesService(
//       document.createElement("div")
//     );

//     service.getDetails(
//       { placeId, language: "sr-Latn" }, // latinica
//       (details, status) => {
//         if (
//           status === window.google.maps.places.PlacesServiceStatus.OK &&
//           details.geometry &&
//           details.geometry.location
//         ) {
//           let address = details.formatted_address || "";

//           // Zameni "Serbia" → "Srbija"
//           address = address.replace(/\bSerbia\b/g, "Srbija");

//           const lat = details.geometry.location.lat();
//           const lng = details.geometry.location.lng();

//           // Vrati roditelju podatke
//           onSelect({
//             lat,
//             lng,
//             address,
//             name: details.name,
//           });
//         }
//       }
//     );
//   };

//   useEffect(() => {
//     if (selected) {
//       getLatLng(selected);
//     }
//   }, [selected]);

//   return (
//     <div className="flex flex-col gap-2">
//       {label && <label className="text-sm font-medium">{label}</label>}

//       <GooglePlacesAutocomplete
//         apiKey={import.meta.env.VITE_GOOGLE_API_KEY}
//         apiOptions={{ language: "sr-Latn", region: "rs" }} // latinica, region RS
//         selectProps={{
//           value: selected,
//           onChange: (place) => setSelected(place),
//           placeholder: "Unesite lokaciju...",
//           isClearable: true,
//           styles: {
//             control: (provided) => ({
//               ...provided,
//               backgroundColor: "#f1f1f1",
//               border: "1px solid #ccc",
//             }),
//           },
//         }}
//       />
//     </div>
//   );
// }

// export default LocationAutocomplete;
import React, { useState, useEffect } from "react";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";

function LocationAutocomplete({ label, value, onSelect }) {
  const [selected, setSelected] = useState(null);

  // Osiguravamo da se prikaže inicijalna vrednost
  useEffect(() => {
    if (value && !selected) {
      setSelected({
        label: value,
        value: {
          description: value,
          place_id: "initial-value",
        },
      });
    }
  }, [value, selected]);

  const getLatLng = (place) => {
    if (!place || !window.google) return;

    const placeId = place.value.place_id;
    const service = new window.google.maps.places.PlacesService(
      document.createElement("div")
    );

    service.getDetails({ placeId, language: "sr-Latn" }, (details, status) => {
      if (
        status === window.google.maps.places.PlacesServiceStatus.OK &&
        details.geometry &&
        details.geometry.location
      ) {
        let address = details.formatted_address || "";
        address = address.replace(/\bSerbia\b/g, "Srbija");

        const lat = details.geometry.location.lat();
        const lng = details.geometry.location.lng();

        onSelect({
          lat,
          lng,
          address,
          name: details.name,
        });
      }
    });
  };

  useEffect(() => {
    if (selected && selected.value.place_id !== "initial-value") {
      getLatLng(selected);
    }
  }, [selected]);

  return (
    <div className="flex flex-col gap-2">
      {label && <label className="text-sm font-medium">{label}</label>}

      <GooglePlacesAutocomplete
        apiKey={import.meta.env.VITE_GOOGLE_API_KEY}
        apiOptions={{ language: "sr-Latn", region: "rs" }}
        selectProps={{
          value: selected,
          // onChange: setSelected,
          onChange: (value) => {
            setSelected(value);
            if (value === null) {
              // Kad klikne X, resetuj na prazne vrednosti
              onSelect({
                address: "",
                lat: null,
                lng: null,
                name: "",
              });
            } else {
              onSelect(value);
            }
          },
          placeholder: "Unesite lokaciju...",
          isClearable: true,
          // styles: {
          //   control: (provided) => ({
          //     ...provided,
          //     backgroundColor: "#f1f1f1",
          //     border: "1px solid #ccc",
          //   }),
          // },
          styles: {
            control: (provided, state) => ({
              ...provided,
              minHeight: "44px",
              height: "44px",
              backgroundColor: "#f1f1f1",
              border: "1px solid #ccc",
              boxShadow: state.isFocused ? "0 0 0 1px #2684FF" : "none",
            }),
            valueContainer: (provided) => ({
              ...provided,
              minHeight: "44px",
              height: "44px",
              padding: "0 8px",
            }),
            input: (provided) => ({
              ...provided,
              margin: 0,
              padding: 0,
            }),
            indicatorsContainer: (provided) => ({
              ...provided,
              height: "44px",
            }),
          },
        }}
      />
    </div>
  );
}

export default LocationAutocomplete;
///////////////////////////////////////////////////////////////////
// import React, { useState, useEffect } from "react";

// // ✅ Funkcija za konverziju ćirilice u latinicu sa kvačicama
// const toLatin = (str) => {
//   const map = {
//     А: "A",
//     Б: "B",
//     В: "V",
//     Г: "G",
//     Д: "D",
//     Ђ: "Đ",
//     Е: "E",
//     Ж: "Ž",
//     З: "Z",
//     И: "I",
//     Ј: "J",
//     К: "K",
//     Л: "L",
//     Љ: "Lj",
//     М: "M",
//     Н: "N",
//     Њ: "Nj",
//     О: "O",
//     П: "P",
//     Р: "R",
//     С: "S",
//     Т: "T",
//     Ћ: "Ć",
//     У: "U",
//     Ф: "F",
//     Х: "H",
//     Ц: "C",
//     Ч: "Č",
//     Џ: "Dž",
//     Ш: "Š",
//     а: "a",
//     б: "b",
//     в: "v",
//     г: "g",
//     д: "d",
//     ђ: "đ",
//     е: "e",
//     ж: "ž",
//     з: "z",
//     и: "i",
//     ј: "j",
//     к: "k",
//     л: "l",
//     љ: "lj",
//     м: "m",
//     н: "n",
//     њ: "nj",
//     о: "o",
//     п: "p",
//     р: "r",
//     с: "s",
//     т: "t",
//     ћ: "ć",
//     у: "u",
//     ф: "f",
//     х: "h",
//     ц: "c",
//     ч: "č",
//     џ: "dž",
//     ш: "š",
//   };
//   return str
//     .split("")
//     .map((c) => map[c] || c)
//     .join("");
// };

// // 📌 Formatiranje kratke, čiste adrese
// const formatShortAddress = (place) => {
//   if (!place.address) return toLatin(place.display_name);

//   let city =
//     place.address.city ||
//     place.address.town ||
//     place.address.village ||
//     place.address.hamlet ||
//     "";

//   let country = place.address.country
//     ? place.address.country.replace("Serbia", "Srbija")
//     : "";

//   // uklanjanje nepotrebnih termina
//   city = city.replace(/Urban Municipality|City of|Opština/gi, "").trim();

//   return toLatin([city, country].filter(Boolean).join(", "));
// };

// function LocationAutocomplete({ label, value, onSelect }) {
//   const [query, setQuery] = useState(value?.address || "");
//   const [results, setResults] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const removeDiacritics = (str) => {
//     return str
//       .normalize("NFD") // razloži slova i kvačice
//       .replace(/[\u0300-\u036f]/g, ""); // ukloni kvačice
//   };

//   //   const fetchLocations = async (searchText) => {
//   //     if (!searchText) {
//   //       setResults([]);
//   //       return;
//   //     }

//   //     setLoading(true);
//   //     try {

//   //       const query = removeDiacritics(toLatin(searchText)); // ⬅ normalizacija
//   //       const res = await fetch(
//   //         `https://nominatim.openstreetmap.org/search?` +
//   //           new URLSearchParams({
//   //             q: query,
//   //             format: "json",
//   //             addressdetails: 1,
//   //             limit: 10,
//   //             countrycodes: "rs,ba,hr,me,mk,si",
//   //             accept_language: "sr", // vrati sa kvačicama
//   //           }),
//   //         { headers: { "User-Agent": "YourAppName/1.0" } }
//   //       );

//   //       let data = await res.json();

//   //       // ✅ Uklanjanje duplikata po formatShortAddress
//   //       const seen = new Set();
//   //       data = data.filter((place) => {
//   //         const key = formatShortAddress(place);
//   //         if (seen.has(key)) return false;
//   //         seen.add(key);
//   //         return true;
//   //       });

//   //       setResults(data);
//   //     } catch (error) {
//   //       console.error("Greška prilikom pretrage lokacije:", error);
//   //     }
//   //     setLoading(false);
//   //   };
//   const fetchLocations = async (searchText) => {
//     if (!searchText) {
//       setResults([]);
//       return;
//     }

//     setLoading(true);
//     try {
//       const res = await fetch(
//         `https://nominatim.openstreetmap.org/search?` +
//           new URLSearchParams({
//             q: searchText,
//             format: "json",
//             addressdetails: 1,
//             namedetails: 1, // 👈 dodatno da dobijemo imena na više jezika
//             limit: 5,
//             countrycodes: "rs,ba,hr,me,mk,si",
//             accept_language: "sr-Latn", // 👈 forsiramo latinicu
//           }),
//         { headers: { "User-Agent": "YourAppName/1.0" } }
//       );

//       const data = await res.json();

//       // 🛠 Izbacivanje duplikata + čišćenje
//       const uniqueResults = [];
//       const seen = new Set();

//       data.forEach((place) => {
//         // prvo pokušaj name:sr-Latn, ako nema, onda place.display_name
//         const nameLatn =
//           place.namedetails?.["name:sr-Latn"] ||
//           place.namedetails?.name ||
//           place.display_name;

//         // format: "Naziv, Srbija"
//         const shortAddress = formatShortAddress({
//           address: place.address,
//           display_name: nameLatn,
//         });

//         if (!seen.has(shortAddress)) {
//           seen.add(shortAddress);
//           uniqueResults.push({
//             ...place,
//             shortAddress,
//           });
//         }
//       });

//       setResults(uniqueResults);
//     } catch (error) {
//       console.error("Greška prilikom pretrage lokacije:", error);
//     }
//     setLoading(false);
//   };

//   const handleSelect = (place) => {
//     const shortAddress = formatShortAddress(place);

//     const locationData = {
//       lat: parseFloat(place.lat),
//       lng: parseFloat(place.lon),
//       address: shortAddress,
//       name:
//         place.address?.city ||
//         place.address?.town ||
//         place.address?.village ||
//         shortAddress,
//     };

//     onSelect(locationData);
//     setQuery(shortAddress);
//     setResults([]);
//   };

//   useEffect(() => {
//     const delayDebounce = setTimeout(() => {
//       fetchLocations(query);
//     }, 400);

//     return () => clearTimeout(delayDebounce);
//   }, [query]);

//   return (
//     <div className="flex flex-col gap-2 relative">
//       {label && <label className="text-sm font-medium">{label}</label>}
//       <input
//         type="text"
//         value={query}
//         placeholder="Unesite lokaciju..."
//         onChange={(e) => setQuery(e.target.value)}
//         className="p-2 border rounded w-full"
//       />
//       {loading && (
//         <div className="absolute top-full left-0 bg-white p-2 text-sm">
//           Pretraga...
//         </div>
//       )}
//       {results.length > 0 && (
//         <ul className="absolute top-full left-0 w-full bg-white border rounded shadow-md max-h-60 overflow-y-auto z-10">
//           {results.map((place) => (
//             <li
//               key={place.place_id}
//               className="p-2 hover:bg-gray-100 cursor-pointer text-sm"
//               onClick={() => handleSelect(place)}
//             >
//               {place.shortAddress}
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// }

// export default LocationAutocomplete;
