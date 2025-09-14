// backend/services/aiAgent.js
import OpenAI from "openai";
import Vehicle from "../models/Vehicle.js"; // 👈 dodaj import

const client = new OpenAI({
  baseURL: "http://localhost:11434/v1",
  apiKey: "ollama",
});

export async function findBestRoutes(start, end, date, goods) {
  // 👇 ovde parsiramo goods (npr. "6200kg 8 paleta 120x80x180cm")
  const weightMatch = goods.match(/(\d+)\s*kg/i);
  const palletsMatch = goods.match(/(\d+)\s*palet/i);
  const dimsMatch = goods.match(/(\d+)\s*[x×]\s*(\d+)\s*[x×]\s*(\d+)/i);

  const weight = weightMatch ? parseInt(weightMatch[1], 10) : null;
  const pallets = palletsMatch ? parseInt(palletsMatch[1], 10) : null;
  const dimensions = dimsMatch
    ? {
        length: parseInt(dimsMatch[1], 10),
        width: parseInt(dimsMatch[2], 10),
        height: parseInt(dimsMatch[3], 10),
      }
    : null;

  console.log("Parsed request:", { weight, pallets, dimensions });

  // 👇 query ka vozilima
  let vehicles = await Vehicle.find();

  vehicles = vehicles.filter((v) => {
    if (weight && v.capacity < weight) return false;
    if (pallets && (!v.pallets || v.pallets < pallets)) return false;
    if (dimensions) {
      if (
        (v.dimensions?.length || 0) < dimensions.length ||
        (v.dimensions?.width || 0) < dimensions.width ||
        (v.dimensions?.height || 0) < dimensions.height
      ) {
        return false;
      }
    }
    return true;
  });

  // Ako nema pogodaka → fallback na AI
  if (vehicles.length === 0) {
    const prompt = `
Korisnik traži prevoz:
Polazna: ${start}
Krajnja: ${end}
Datum: ${date}
Roba: ${goods}

Nema odgovarajućih vozila u bazi.
Predloži alternativne rute i sve gradove usput.
Odgovori na srpskom jeziku.
    `;

    const completion = await client.chat.completions.create({
      model: "mistral:7b",
      messages: [{ role: "user", content: prompt }],
    });

    return completion.choices[0].message.content;
  }

  // Ako ima pogodaka → vratimo ih kao rezultat
  return vehicles.map((v) => ({
    type: v.type,
    capacity: v.capacity,
    pallets: v.pallets,
    dimensions: v.dimensions,
    licensePlate: v.licensePlate,
  }));
}

// // services/aiAgent.js ako se koristi openai
// import OpenAI from "openai";
// import dotenv from "dotenv";

// dotenv.config();

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// /**
//  * Funkcija koja koristi AI da pronađe najbolje rute na osnovu korisničkog zahteva.
//  * @param {string} start - Polazna lokacija.
//  * @param {string} end - Krajnja lokacija.
//  * @param {string} date - Datum transporta.
//  * @param {string} goods - Opis robe.
//  * @returns {Promise<string>} - AI generisan odgovor.
//  */
// export async function findBestRoutes(start, end, date, goods) {
//   try {
//     const prompt = `
// Korisnik traži prevoz.
// Polazna lokacija: ${start}
// Krajnja lokacija: ${end}
// Datum: ${date}
// Opis robe: ${goods}

// Nađi najbolje ponude iz baze podataka (ako baza postoji) ili predloži alternativne lokacije usput koje bi odgovarale.
// Odgovori isključivo na srpskom jeziku.
//     `;

//     const completion = await openai.chat.completions.create({
//       model: "gpt-4o-mini",
//       messages: [{ role: "user", content: prompt }],
//     });

//     return completion.choices[0].message.content;
//   } catch (error) {
//     console.error("Greška u AI agentu:", error);
//     throw error;
//   }
// }
