// backend/routes/aiagentRoute.js
import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import {
  SYSTEM_PROMPT,
  getRouteGeojson,
  isPointNearRoute,
  extractFirstJson,
} from "../utils/ai.js";
import { geocodeText, haversineDistance } from "../utils/geo.js";
import { findBestRoutes } from "../services/aiAgent.js";
import Tour from "../models/Tour.js";
import Vehicle from "../models/Vehicle.js";

dotenv.config();

const aiagentRouter = express.Router();
const OLLAMA_URL = process.env.OLLAMA_URL || "http://localhost:11434";

const escapeRegex = (s = "") => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// mala pomoć za dan
function dayRange(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  const start = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0);
  const end = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59);
  return { $gte: start, $lte: end };
}

function parseDateString(str) {
  if (!str) {
    console.log("🕒 parseDateString: input is empty/null");
    return null;
  }

  const lower = String(str).toLowerCase().trim();

  const today = new Date();
  if (lower.includes("danas")) {
    console.log("🕒 parseDateString: matched 'danas'");
    return today;
  }

  if (lower.includes("sutra")) {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    console.log("🕒 parseDateString: matched 'sutra' ->", d);
    return d;
  }

  if (lower.includes("prekosutra")) {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    console.log("🕒 parseDateString: matched 'prekosutra' ->", d);
    return d;
  }

  // dd[.-/ ]MM[.-/ ](yyyy|yy)?
  let m = lower.match(/(\d{1,2})[.\-/\s](\d{1,2})(?:[.\-/\s](\d{2,4}))?/);
  if (m) {
    const day = parseInt(m[1], 10);
    const month = parseInt(m[2], 10) - 1;
    // ako nema godine, koristi trenutnu
    let year = m[3] ? parseInt(m[3], 10) : new Date().getFullYear();
    // normalize 2-cifrenu godinu (npr. 25 -> 2025)
    if (year < 100) year += 2000;
    const d = new Date(year, month, day);
    if (!isNaN(d)) {
      console.log("🕒 parseDateString: matched numeric date ->", d);
      return d;
    }
  }

  // dd <mesec> [yyyy]? — podrži pune i skraćene nazive/korene
  const monthStems = {
    januar: 0,
    jan: 0,
    februar: 1,
    feb: 1,
    februar: 1,
    febru: 1,
    mart: 2,
    april: 3,
    apr: 3,
    maj: 4,
    jun: 5,
    jul: 6,
    avgust: 7,
    avg: 7,
    septembar: 8,
    sept: 8,
    sep: 8,
    oktobar: 9,
    okt: 9,
    oktob: 9,
    novembar: 10,
    nov: 10,
    decembar: 11,
    dec: 11,
  };
  m = lower.match(/(\d{1,2})\s*([a-zčćšđž]+)\s*(\d{2,4})?/i);
  if (m) {
    const day = parseInt(m[1], 10);
    const mesecToken = m[2];
    const foundKey = Object.keys(monthStems).find((k) =>
      mesecToken.startsWith(k)
    );
    if (foundKey !== undefined) {
      const month = monthStems[foundKey];
      let year = m[3] ? parseInt(m[3], 10) : new Date().getFullYear();
      if (year < 100) year += 2000;
      const d = new Date(year, month, day);
      if (!isNaN(d)) {
        console.log("🕒 parseDateString: matched verbal month ->", d);
        return d;
      }
    }
  }

  // fallback na native parser (može biti nepouzdan za srpske formate)
  const d = new Date(str);
  if (!isNaN(d)) {
    console.log("🕒 parseDateString: native Date parsed ->", d);
    return d;
  }

  console.log(
    "🕒 parseDateString: could not parse -> returning null for:",
    str
  );
  return null;
}

// aiagentRouter.post("/message", async (req, res) => {
//   try {
//     const userText = req.body?.text || "";

//     // 1) LLM parsing
//     const { data } = await axios.post(`${OLLAMA_URL}/api/chat`, {
//       model: "mistral:7b",
//       messages: [
//         { role: "system", content: SYSTEM_PROMPT },
//         { role: "user", content: userText },
//       ],
//       stream: false,
//     });

//     const raw = data?.message?.content || "";
//     const parsed = extractFirstJson(raw) || {};
//     const {
//       from = null,
//       to = null,
//       date = null,
//       cargo = null,
//       pallets = null,
//       length_m = null,
//       width_m = null,
//       height_m = null,
//       weight_kg = null,
//     } = parsed;

//     if (!from || !to) {
//       return res.json({
//         ok: true,
//         parsed,
//         reply:
//           "Razumeo sam. Molim te reci i polazište i odredište (npr. 'Niš do Beograda').",
//         results: [],
//       });
//     }

//     // 2) Geokodifikacija (precizno)
//     const start = await geocodeText(from);
//     const end = await geocodeText(to);
//     if (!start || !end) {
//       return res.json({
//         ok: true,
//         parsed,
//         reply:
//           "Razumeo sam. Možeš li da preciziraš tačnija imena mesta (npr. 'Niš', 'Beograd')? Trenutno ih ne mogu geokodirati.",
//         results: [],
//       });
//     }

//     console.log("📍 Start geocode result:", start);
//     console.log("📍 End geocode result:", end);

//     // 3) Ruta (OSRM)
//     const route = await getRouteGeojson(
//       { lat: start.lat, lng: start.lng },
//       { lat: end.lat, lng: end.lng }
//     );
//     console.log("🛣️ Route geometry:", route);

//     // 4) Pretraga iz baze (prefilter oko 200km od polazišta i odredišta)
//     // const dateFilter = dayRange(date);
//     const parsedDate = parseDateString(date);
//     const dateFilter = parsedDate ? dayRange(parsedDate) : null;
//     console.log("🕒 Parsed date:", parsedDate, "from raw:", date);

//     let preCandidates = await Tour.find({
//       ...(dateFilter ? { date: dateFilter } : {}),
//       startPoint: {
//         $nearSphere: {
//           $geometry: { type: "Point", coordinates: [start.lng, start.lat] },
//           $maxDistance: 30_000, // 200 km od polazišta
//         },
//       },
//     })
//       .limit(1000) // uzmi više jer ćemo kasnije suziti
//       .lean();

//     // 4b) Ručna provera da li je endPoint u krugu od 200 km od odredišta
//     preCandidates = preCandidates.filter((t) => {
//       if (!t.endPoint?.coordinates) return false;
//       const [lng, lat] = t.endPoint.coordinates;
//       const distance = haversineDistance(end.lat, end.lng, lat, lng);
//       return distance <= 30_000;
//     });

//     // 5) Rangiraj po ruti + kapacitetu
//     let results = preCandidates.map((t) => {
//       const tStart = {
//         lat: t.startLocation?.lat,
//         lng: t.startLocation?.lng,
//       };
//       const tEnd = {
//         lat: t.endLocation?.lat,
//         lng: t.endLocation?.lng,
//       };

//       const nearStart = route?.geometry
//         ? isPointNearRoute(tStart, route.geometry, 15)
//         : false;
//       const nearEnd = route?.geometry
//         ? isPointNearRoute(tEnd, route.geometry, 15)
//         : false;

//       let score = 0;
//       if (nearStart) score += 1;
//       if (nearEnd) score += 1;
//       if (pallets && t.capacity?.pallets && t.capacity.pallets >= pallets)
//         score += 0.5;
//       if (date && t.date) score += 0.25; // blaga prednost istog dana

//       return { ...t, score };
//     });

//     results = results.sort((a, b) => b.score - a.score);
//     console.log("🔍 Found results:", results);

//     const reply = route
//       ? `Razumeo sam: ${start.name} → ${end.name}${
//           date ? `, datum: ${date}` : ""
//         }. Ruta je oko ${route.distance_km.toFixed(
//           0
//         )} km. Vreme prevoza je oko ${route.duration_min.toFixed(
//           0
//         )} Pronašao sam ${
//           results.length
//         } prevoza. Da li želiš da im pošaljem poruku umesto tebe?`
//       : `Razumeo sam: ${start.name} → ${end.name}${
//           date ? `, datum: ${date}` : ""
//         }. Pronašao sam ${results.length} prevoza.`;

//     res.json({
//       ok: true,
//       parsed,
//       route: route
//         ? {
//             distance_km: route.distance_km,
//             duration_min: route.duration_min,
//           }
//         : null,
//       results,
//       reply,
//     });
//   } catch (e) {
//     console.error(e);
//     res.status(500).json({ ok: false, error: "Agent error" });
//   }
// });
aiagentRouter.post("/message", async (req, res) => {
  try {
    const userText = req.body?.text || "";

    // 1) LLM parsing (OSTAVLJENO KAKO JE BILO)
    const { data } = await axios.post(`${OLLAMA_URL}/api/chat`, {
      model: "mistral:7b",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userText },
      ],
      stream: false,
    });

    const raw = data?.message?.content || "";
    const parsed = extractFirstJson(raw) || {};
    const {
      from = null,
      to = null,
      date = null,
      cargo = null,
      pallets = null,
      length_m = null,
      width_m = null,
      height_m = null,
      weight_kg = null,
    } = parsed;

    if (!from || !to) {
      return res.json({
        ok: true,
        parsed,
        reply:
          "Razumeo sam. Molim te reci i polazište i odredište (npr. 'Niš do Beograda').",
        results: [],
      });
    }

    // 2) Geokodifikacija (precizno)
    const start = await geocodeText(from);
    const end = await geocodeText(to);
    if (!start || !end) {
      return res.json({
        ok: true,
        parsed,
        reply:
          "Razumeo sam. Možeš li da preciziraš tačnija imena mesta (npr. 'Niš', 'Beograd')? Trenutno ih ne mogu geokodirati.",
        results: [],
      });
    }

    console.log("📍 Start geocode result:", start);
    console.log("📍 End geocode result:", end);

    // 3) Ruta (OSRM)
    const route = await getRouteGeojson(
      { lat: start.lat, lng: start.lng },
      { lat: end.lat, lng: end.lng }
    );
    console.log("🛣️ Route geometry:", route);

    // 4) Pretraga iz baze (prefilter oko 200km od polazišta i odredišta)
    // const dateFilter = dayRange(date);
    const parsedDate = parseDateString(date);
    const dateFilter = parsedDate ? dayRange(parsedDate) : null;
    console.log("🕒 Parsed date:", parsedDate, "from raw:", date);

    let preCandidates = await Tour.find({
      ...(dateFilter ? { date: dateFilter } : {}),
      startPoint: {
        $nearSphere: {
          $geometry: { type: "Point", coordinates: [start.lng, start.lat] },
          $maxDistance: 200_000, // 200 km od polazišta
        },
      },
    })
      .limit(1000) // uzmi više jer ćemo kasnije suziti
      .lean();

    // 4b) Ručna provera da li je endPoint u krugu od 200 km od odredišta
    preCandidates = preCandidates.filter((t) => {
      if (!t.endPoint?.coordinates) return false;
      const [lng, lat] = t.endPoint.coordinates;
      const distance = haversineDistance(end.lat, end.lng, lat, lng);
      return distance <= 200_000;
    });

    // 5) Rangiraj po ruti + kapacitetu
    let results = preCandidates.map((t) => {
      // CHANGE: koristi tačne koordinate iz GeoJSON-a; fallback na *_Lat/Lng ako je potrebno
      const tStart =
        t.startPoint?.coordinates?.length === 2
          ? {
              lat: t.startPoint.coordinates[1],
              lng: t.startPoint.coordinates[0],
            }
          : t.startLocationLat && t.startLocationLng
          ? { lat: t.startLocationLat, lng: t.startLocationLng }
          : null;

      const tEnd =
        t.endPoint?.coordinates?.length === 2
          ? { lat: t.endPoint.coordinates[1], lng: t.endPoint.coordinates[0] }
          : t.endLocationLat && t.endLocationLng
          ? { lat: t.endLocationLat, lng: t.endLocationLng }
          : null;

      if (!tStart || !tEnd) {
        // ako nema koordinata, ne može da se rangira uz rutu
        return { ...t, score: -Infinity };
      }

      // CHANGE: ubrzano poređenje — u isPointNearRoute je dodatno subsamplovanje
      const nearStart = route?.geometry
        ? isPointNearRoute(tStart, route.geometry, 15)
        : false;
      const nearEnd = route?.geometry
        ? isPointNearRoute(tEnd, route.geometry, 15)
        : false;

      let score = 0;
      if (nearStart) score += 1;
      if (nearEnd) score += 1;
      if (pallets && t.capacity?.pallets && t.capacity.pallets >= pallets)
        score += 0.5;
      if (parsedDate && t.date) score += 0.25; // blaga prednost istog dana

      return { ...t, score };
    });

    // filtriraj one koji nisu mogli da se rangiraju
    results = results.filter((r) => r.score > -Infinity);
    results = results.sort((a, b) => b.score - a.score);
    console.log("🔍 Found results:", results);

    // CHANGE: ako datum nije prepoznat, ubaci jasnu poruku za korisnika
    const needsDatePrompt = !parsedDate;
    const datePrompt = needsDatePrompt
      ? " Unesi datum u formatu dd.MM.yyyy (npr. 15.08.2025)."
      : "";

    const reply = route
      ? `Razumeo sam: ${start.name} → ${end.name}${
          date ? `, datum: ${date}` : ""
        }. Ruta je oko ${route.distance_km.toFixed(
          0
        )} km. Vreme prevoza je oko ${route.duration_min.toFixed(
          0
        )} min. Pronašao sam ${
          results.length
        } prevoza. Da li želiš da im pošaljem poruku umesto tebe?${datePrompt}`
      : `Razumeo sam: ${start.name} → ${end.name}${
          date ? `, datum: ${date}` : ""
        }. Pronašao sam ${results.length} prevoza.${datePrompt}`;

    res.json({
      ok: true,
      parsed,
      route: route
        ? {
            distance_km: route.distance_km,
            duration_min: route.duration_min,
          }
        : null,
      results,
      reply,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok: false, error: "Agent error" });
  }
});

aiagentRouter.post("/find-routes", async (req, res) => {
  try {
    const {
      date,
      startLocation,
      endLocation,
      vehicleType,
      cargoWeight,
      pallets,
      dimensions,
    } = req.body;

    console.log("🟢 Upit za pronalazak tura:", req.body);

    if (!date) {
      return res.status(400).json({ error: "Nedostaje datum" });
    }

    const dayStart = new Date(date);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(date);
    dayEnd.setHours(23, 59, 59, 999);

    // konsoliduj vrednosti
    const startText = (startLocation ?? start ?? "").trim();
    const endText = (endLocation ?? end ?? "").trim();
    const vehicleWanted = (vehicleType ?? vehicle ?? "").trim().toLowerCase();
    const weightWanted = cargoWeight ?? weightKg ?? null;

    // OBAVEZNO filtriramo start (mora da odgovara)
    const query = {
      date: { $gte: dayStart, $lte: dayEnd },
      ...(startText && {
        startLocation: {
          $regex: new RegExp("^" + escapeRegex(startText), "i"),
        },
      }),
    };

    // Ako korisnik unese end → želimo *ili* taj end *ili* prazan end (bilo gde)
    if (endText) {
      query.$or = [
        {
          endLocation: { $regex: new RegExp("^" + escapeRegex(endText), "i") },
        },
        { endLocation: { $exists: false } },
        { endLocation: "" },
        { endLocation: null },
      ];
    }
    // Ako korisnik ne unese end → ne ograničavamo end uopšte.

    const tours = await Tour.find(query)
      .populate("vehicle")
      .populate("createdBy");

    // Filtriranje po tipu vozila i nosivosti
    let filtered = tours.filter((t) => {
      const typeOk =
        !vehicleWanted || t.vehicle?.type?.toLowerCase() === vehicleWanted;
      const capOk =
        weightWanted == null ||
        (t.vehicle?.capacity ?? 0) >= Number(weightWanted);
      return typeOk && capOk;
    });
    console.log("main filtered", filtered);

    if (pallets) {
      filtered = filtered.filter(
        (t) => (t.vehicle?.pallets ?? 0) >= Number(pallets)
      );
    }
    console.log("main filtered+pallets", filtered);

    if (dimensions?.length && dimensions?.width && dimensions?.height) {
      filtered = filtered.filter((t) => {
        const vd = t.vehicle?.dimensions || {};
        return (
          (vd.length ?? 0) >= Number(dimensions.length) &&
          (vd.width ?? 0) >= Number(dimensions.width) &&
          (vd.height ?? 0) >= Number(dimensions.height)
        );
      });
    }
    console.log("main filtered+dimensions", filtered);

    return res.json({ routes: filtered });
  } catch (err) {
    console.error("❌ Greška u /find-routes:", err);
    return res.status(500).json({ error: "Server error" });
  }
});
//     // Nađi ture po kriterijumima

//     const query = {
//       date: {
//         $gte: new Date(date).setHours(0, 0, 0),
//         $lte: new Date(date).setHours(23, 59, 59),
//       },
//       startLocation: { $regex: new RegExp(startLocation, "i") },
//     };

//     // ako korisnik unese endLocation
//     if (endLocation) {
//       query.$or = [
//         { endLocation: { $regex: new RegExp(endLocation, "i") } },
//         { endLocation: { $exists: false } },
//         { endLocation: "" },
//         { endLocation: null },
//       ];
//     }

//     const tours = await Tour.find(query)
//       .populate("vehicle")
//       .populate("createdBy");

//     // Filtriranje po tipu i nosivosti
//     let filtered = tours.filter(
//       (t) =>
//         (!vehicleType ||
//           t.vehicle?.type?.toLowerCase() === vehicleType.toLowerCase()) &&
//         (!cargoWeight || t.vehicle?.capacity >= cargoWeight)
//     );
//     if (pallets) {
//       filtered = filtered.filter((t) => t.vehicle?.pallets >= pallets);
//     }

//     if (dimensions?.length && dimensions?.width && dimensions?.height) {
//       filtered = filtered.filter(
//         (t) =>
//           t.vehicle?.dimensions?.length >= dimensions.length &&
//           t.vehicle?.dimensions?.width >= dimensions.width &&
//           t.vehicle?.dimensions?.height >= dimensions.height
//       );
//     }

//     res.json({ routes: filtered });
//   } catch (err) {
//     console.error("❌ Greška u /find-routes:", err);
//     res.status(500).json({ error: "Server error" });
//   }
// });

export default aiagentRouter;
