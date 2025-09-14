import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { requireRole } from "../middlewares/roleMiddleware.js";
import User from "../models/User.js";
import Ad from "../models/Ad.js"; // 👈 moraš napraviti model oglasa

const admin = express.Router();

// ✅ Lista svih korisnika
admin.get(
  "/users",
  authMiddleware,
  requireRole(["admin", "moderator"]),
  async (req, res) => {
    try {
      const users = await User.find().select("-password");
      res.json(users);
    } catch (err) {
      res.status(500).json({ error: "Greška pri učitavanju korisnika" });
    }
  }
);

// ✅ Banovanje korisnika
admin.put(
  "/users/:id/ban",
  authMiddleware,
  requireRole(["admin"]),
  async (req, res) => {
    try {
      await User.findByIdAndUpdate(req.params.id, { banned: true });
      res.json({ message: "Korisnik banovan" });
    } catch (err) {
      res.status(500).json({ error: "Greška pri banovanju" });
    }
  }
);

// ✅ Lista oglasa za odobravanje
admin.get(
  "/ads/pending",
  authMiddleware,
  requireRole(["admin", "moderator"]),
  async (req, res) => {
    try {
      const ads = await Ad.find({ status: "pending" });
      res.json(ads);
    } catch (err) {
      res.status(500).json({ error: "Greška pri učitavanju oglasa" });
    }
  }
);

// ✅ Odobravanje oglasa
admin.put(
  "/ads/:id/approve",
  authMiddleware,
  requireRole(["admin", "moderator"]),
  async (req, res) => {
    try {
      await Ad.findByIdAndUpdate(req.params.id, { status: "approved" });
      res.json({ message: "Oglas odobren" });
    } catch (err) {
      res.status(500).json({ error: "Greška pri odobravanju oglasa" });
    }
  }
);

// ✅ Odbijanje oglasa
admin.put(
  "/ads/:id/reject",
  authMiddleware,
  requireRole(["admin", "moderator"]),
  async (req, res) => {
    try {
      await Ad.findByIdAndUpdate(req.params.id, { status: "rejected" });
      res.json({ message: "Oglas odbijen" });
    } catch (err) {
      res.status(500).json({ error: "Greška pri odbijanju oglasa" });
    }
  }
);

export default admin;
