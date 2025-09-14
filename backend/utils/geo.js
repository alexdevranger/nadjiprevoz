// // // backend/utils/geo.js
// import axios from "axios";
// import dotenv from "dotenv";
// dotenv.config();

// export async function geocodeText(q) {
//   const GOOGLE_KEY = process.env.GOOGLE_KEY || "";
//   const REGION = (process.env.COUNTRY_HINT || "rs").toLowerCase();

//   try {
//     if (GOOGLE_KEY) {
//       const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
//         q
//       )}&region=${REGION}&key=${GOOGLE_KEY}`;
//       const { data } = await axios.get(url);
//       console.log("geocodeText", data?.results?.length);

//       if (data.results?.length) {
//         const loc = data.results[0].geometry.location;
//         return {
//           lat: loc.lat,
//           lng: loc.lng,
//           address: data.results[0].formatted_address,
//         };
//       }
//     } else {
//       console.warn("⚠️ Nema GOOGLE_GEOCODE_KEY, geokodiranje neće raditi.");
//       return null;
//     }

//     //Fallback na OSMR server
//     const osmUrl = `${NOMINATIM_URL}/search?format=json&q=${encodeURIComponent(q)}&accept-language=sr&countrycodes=${REGION}`;
//     const { data: osmData } = await axios.get(osmUrl);

//     if (osmData?.length) {
//       return {
//         lat: parseFloat(osmData[0].lat),
//         lng: parseFloat(osmData[0].lon),
//         address: osmData[0].display_name,
//       };
//     }

//     return null;
//   } catch (err) {
//     console.error("Greška u geocodeText:", err);
//     return null;
//   }
// }
// // backend/utils/geo.js
// import axios from "axios";
// import dotenv from "dotenv";

// dotenv.config();

// export async function geocodeText(q) {
//   const REGION = (process.env.COUNTRY_HINT || "rs").toLowerCase();
//   const NOMINATIM_URL =
//     process.env.NOMINATIM_URL || "https://nominatim.openstreetmap.org";

//   try {
//     const url = `${NOMINATIM_URL}/search?format=json&q=${encodeURIComponent(
//       q
//     )}&accept-language=sr&countrycodes=${REGION}`;

//     const { data } = await axios.get(url, {
//       headers: { "User-Agent": "TransportApp" },
//     });

//     if (data?.length) {
//       return {
//         lat: parseFloat(data[0].lat),
//         lng: parseFloat(data[0].lon),
//         address: data[0].display_name,
//       };
//     }

//     return null;
//   } catch (err) {
//     console.error("Greška u geocodeText:", err.message);
//     return null;
//   }
// }
// export function haversineDistance(lat1, lng1, lat2, lng2) {
//   const R = 6371e3; // poluprečnik Zemlje u metrima
//   const φ1 = (lat1 * Math.PI) / 180;
//   const φ2 = (lat2 * Math.PI) / 180;
//   const Δφ = ((lat2 - lat1) * Math.PI) / 180;
//   const Δλ = ((lng2 - lng1) * Math.PI) / 180;

//   const a =
//     Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
//     Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

//   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

//   return R * c;
// }
// backend/utils/geo.js
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

// transliteracija ćirilice u latinicu
function toLatin(str) {
  const map = {
    А: "A",
    Б: "B",
    В: "V",
    Г: "G",
    Д: "D",
    Ђ: "Đ",
    Е: "E",
    Ж: "Ž",
    З: "Z",
    И: "I",
    Ј: "J",
    К: "K",
    Л: "L",
    Љ: "Lj",
    М: "M",
    Н: "N",
    Њ: "Nj",
    О: "O",
    П: "P",
    Р: "R",
    С: "S",
    Т: "T",
    Ћ: "Ć",
    У: "U",
    Ф: "F",
    Х: "H",
    Ц: "C",
    Ч: "Č",
    Џ: "Dž",
    Ш: "Š",
    а: "a",
    б: "b",
    в: "v",
    г: "g",
    д: "d",
    ђ: "đ",
    е: "e",
    ж: "ž",
    з: "z",
    и: "i",
    ј: "j",
    к: "k",
    л: "l",
    љ: "lj",
    м: "m",
    н: "n",
    њ: "nj",
    о: "o",
    п: "p",
    р: "r",
    с: "s",
    т: "t",
    ћ: "ć",
    у: "u",
    ф: "f",
    х: "h",
    ц: "c",
    ч: "č",
    џ: "dž",
    ш: "š",
  };
  return str.replace(/./g, (ch) => map[ch] || ch);
}

// ekstrakcija samo imena grada
function extractCityName(fullName) {
  if (!fullName) return null;
  let city = fullName.split(",")[0].trim();
  return toLatin(city);
}

export async function geocodeText(q) {
  const GOOGLE_KEY = process.env.GOOGLE_KEY || "";
  const REGION = (process.env.COUNTRY_HINT || "rs").toLowerCase();
  const NOMINATIM_URL =
    process.env.NOMINATIM_URL || "https://nominatim.openstreetmap.org";

  try {
    // 1) Google Maps
    if (GOOGLE_KEY) {
      const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        q
      )}&region=${REGION}&key=${GOOGLE_KEY}`;
      const { data } = await axios.get(url);

      if (data.results?.length) {
        const loc = data.results[0].geometry.location;
        const formatted = data.results[0].formatted_address;
        const city = extractCityName(formatted);

        return {
          lat: loc.lat,
          lng: loc.lng,
          address: city,
          name: city,
        };
      }
    }

    // 2) OSM fallback
    const osmUrl = `${NOMINATIM_URL}/search?format=json&q=${encodeURIComponent(
      q
    )}&accept-language=sr&countrycodes=${REGION}&limit=1`;

    const { data: osmData } = await axios.get(osmUrl, {
      headers: { "User-Agent": "TransportApp" },
    });

    if (osmData?.length) {
      const full = osmData[0].display_name;
      const city = extractCityName(full);

      return {
        lat: parseFloat(osmData[0].lat),
        lng: parseFloat(osmData[0].lon),
        address: city,
        name: city,
      };
    }

    return null;
  } catch (err) {
    console.error("❌ Greška u geocodeText:", err.message);
    return null;
  }
}

export function haversineDistance(lat1, lng1, lat2, lng2) {
  const R = 6371e3; // poluprečnik Zemlje u metrima
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lng2 - lng1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}
