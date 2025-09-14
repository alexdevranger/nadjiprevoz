// backend/routes/offers.js
import express from "express";
import mongoose from "mongoose";
import { io } from "../server.js"; // već export-uješ io iz server.js
import User from "../models/User.js"; // pretpostavka: imaš User model
import Vehicle from "../models/Vehicle.js"; // da bismo našli vlasnike vozila

const offerRouter = express.Router();

/**
 * Vrati listu ID-jeva korisnika koji su "ponudjači".
 * 1) Preferira User.role === 'carrier'
 * 2) Ako to nemaš u šemi, fallback: vlasnici svih vozila
 */
async function getAllCarrierIds() {
  // 1) Probaj preko role
  const haveRoleField = true; // promeni u false ako SIGURNO nemaš role na User
  if (haveRoleField) {
    const carriers = await User.find({ role: "carrier" }).select("_id").lean();
    if (carriers.length > 0) {
      return carriers.map((u) => u._id.toString());
    }
  }

  // 2) Fallback — vlasnici vozila
  const owners = await Vehicle.find({}).select("owner").lean(); // pretpostavka: Vehicle.owner = userId
  const set = new Set();
  owners.forEach((v) => {
    if (v.owner) set.add(v.owner.toString());
  });
  return Array.from(set);
}

/**
 * Pomoćna: robustan emit sa batch-ovanjem (da ne blokira event-loop)
 */
async function emitToAll(ids, event, payload) {
  const BATCH = 200; // po želji
  for (let i = 0; i < ids.length; i += BATCH) {
    const chunk = ids.slice(i, i + BATCH);
    chunk.forEach((id) => io.to(id).emit(event, payload));
    // mali odmor event-loopu
    await new Promise((r) => setTimeout(r, 0));
  }
}

offerRouter.post("/message", async (req, res) => {
  try {
    const { text, meta } = req.body || {};
    if (!text || !text.trim()) {
      return res.status(400).json({ ok: false, error: "Text je obavezan." });
    }

    // 1) Skupi sve ponudjače
    const carrierIds = await getAllCarrierIds();

    if (carrierIds.length === 0) {
      return res.json({
        ok: true,
        sent: 0,
        message:
          "Nema ponudjača u bazi (nema User.role='carrier' niti vlasnika vozila).",
      });
    }

    // 2) Pripremi payload koji će klijenti dobiti preko Socket.IO
    const payload = {
      type: "broadcast-offer",
      text: text.trim(),
      meta: meta || null, // npr. { from:"Niš", to:"Beograd", date:"2025-08-20", pallets:2 } ako želiš
      createdAt: new Date().toISOString(),
    };

    // 3) Emituj u lične sobe ponudjača (u server.js imaš registerUser -> socket.join(userId))
    await emitToAll(carrierIds, "offerNotification", payload);

    // 4) (OPCIONO) Ako želiš da i sačuvaš u bazi kao poruke/obaveštenja — ovde možeš
    //    npr. Napravi Notification model i bulk insert. Za sada preskačemo.

    return res.json({
      ok: true,
      sent: carrierIds.length,
      message: "Poruka je poslata svim ponudjačima.",
    });
  } catch (err) {
    console.error("Greška u /api/offers/message:", err);
    return res.status(500).json({ ok: false, error: "Greška na serveru." });
  }
});

export default offerRouter;
