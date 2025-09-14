// backend/utils/ai.js
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();
/** Pomocna: Haversine za km */
export function haversineKm(a, b) {
  const toRad = (x) => (x * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;

  const distance = 2 * R * Math.asin(Math.sqrt(h));

  // Debug log
  console.log(
    `[haversineKm] A=(${a.lat},${a.lng}), B=(${b.lat},${
      b.lng
    }), dist=${distance.toFixed(2)} km`
  );

  return distance;
}

export async function getRouteGeojson(start, end) {
  // CHANGE: overview=simplified da bi smanjili broj koordinata i izbegli lag
  const url = `${process.env.OSRM_URL}/route/v1/driving/${start.lng},${start.lat};${end.lng},${end.lat}?overview=simplified&geometries=geojson`;
  const { data } = await axios.get(url);
  const route = data?.routes?.[0];
  if (!route) return null;
  return {
    distance_km: route.distance / 1000,
    duration_min: route.duration / 60,
    geometry: route.geometry, // { coordinates: [[lng,lat],...], type: "LineString" }
  };
}

/** Provera da li je tacka blizu rute */
export function isPointNearRoute(point, geojson, toleranceKm = 10) {
  if (!geojson?.coordinates?.length) return false;

  // uzmi overview=simplified iz OSRM-a + dodatno subsampluj (svaku 100-tu tačku)
  const coords = geojson.coordinates;
  for (let i = 0; i < coords.length; i += 100) {
    const [lng, lat] = coords[i];
    const d = haversineKm(point, { lat, lng });
    if (d <= toleranceKm) return true;
  }
  return false;
}

/** Dummy pretraga ponuda — ZAMENI sa pravim DB query-jem (Mongoose itd.) */
export async function searchTours({ start, end, date, pallets, volume }) {
  // Ovde bi u realu: Tour.find({ ... })
  // Za POC: vrati par mock ponuda (prave ponude već imaš; ovde ti je samo šablon).
  return [
    {
      id: "t1",
      carrier: "Marko Transport",
      date: date || "2025-08-15",
      start: { name: "Niš", lat: 43.32, lng: 21.9 },
      end: { name: "Beograd", lat: 44.81, lng: 20.46 },
      capacity: "do 6 paleta",
      note: "Mogu usput preuzimanja.",
    },
    {
      id: "t2",
      carrier: "Cargo Plus",
      date: date || "2025-08-15",
      start: { name: "Jagodina", lat: 43.98, lng: 21.26 },
      end: { name: "Beograd", lat: 44.81, lng: 20.46 },
      capacity: "do 10 paleta",
      note: "Furgon, rampa.",
    },
  ];
}

/** Prompt: izvuci strukturisane podatke sa srpskog */
export const SYSTEM_PROMPT = `
Ti si asistent za transport koji RADI ISKLJUČIVO NA SRPSKOM (latinica).
Prvo iz teksta korisnika izvuci strukturisane podatke u ČIST JSON (bez komentara, bez teksta okolo):

{
  "from": "grad ili adresa",
  "to": "grad ili adresa",
  "date": "YYYY-MM-DD ili null",
  "cargo": "slobodan opis ili null",
  "pallets": broj ili null,
  "length_m": broj ili null,
  "width_m": broj ili null,
  "height_m": broj ili null,
  "weight_kg": broj ili null
}

Nakon JSON-a, dodaj i kratak ljudski odgovor (na srpskom, latinica) koji pojašnjava šta si razumeo i šta ćeš uraditi.
Ako podaci fale, postavi KONKRETNO pitanje (jedno po jedno).
Uvek koristi nazive mesta na srpskom (npr. "Srbija", ne "Serbia"). 
`;

/** Izvuci striktni JSON iz odgovora modela (prva JSON sekcija) */
export function extractFirstJson(text) {
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) return null;
  try {
    return JSON.parse(match[0]);
  } catch {
    return null;
  }
}
