import express from "express";
import Ad from "../models/Ad.js";
import { checkAdStatus } from "../middleware/checkAdStatus.js";
import { adminAuthMiddleware } from "../middleware/adminAuthMiddleware.js";

const router = express.Router();

// GET svi aktivni oglasi
router.get("/", checkAdStatus, async (req, res) => {
  try {
    const now = new Date();

    let query = {};
    if (req.filterActiveAds) {
      query = { status: "active", expiresAt: { $gte: now } };
    }

    const ads = await Ad.find(query).populate("user", "name email");
    res.json(ads);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Greška prilikom učitavanja oglasa" });
  }
});

// GET svi oglasi za admin panel (bez filtera)
router.get("/all", async (req, res) => {
  try {
    const ads = await Ad.find().populate("user", "name email");
    res.json(ads);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Greška prilikom učitavanja svih oglasa" });
  }
});

// 📌 ADMIN: Arhiviranje oglasa
router.post("/admin/:id/archive", adminAuthMiddleware, async (req, res) => {
  try {
    const ad = await Ad.findByIdAndUpdate(
      req.params.id,
      { status: "archived" },
      { new: true }
    );
    if (!ad) return res.status(404).json({ error: "Oglas nije pronađen" });
    res.json({ message: "Oglas je arhiviran", ad });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Greška servera" });
  }
});

// 📌 ADMIN: Produžavanje oglasa
router.post("/admin/:id/renew", adminAuthMiddleware, async (req, res) => {
  try {
    const ad = await Ad.findById(req.params.id);
    if (!ad) return res.status(404).json({ error: "Oglas nije pronađen" });

    const extendDays = req.body.days || 30;
    const newExpiresAt = new Date(ad.expiresAt);
    newExpiresAt.setDate(newExpiresAt.getDate() + extendDays);

    ad.expiresAt = newExpiresAt;
    ad.status = "active";
    await ad.save();

    res.json({ message: "Oglas je produžen", ad });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Greška servera" });
  }
});

// 📌 ADMIN: Promocija oglasa
router.post("/admin/:id/promote", adminAuthMiddleware, async (req, res) => {
  try {
    const ad = await Ad.findByIdAndUpdate(
      req.params.id,
      { isPremium: true },
      { new: true }
    );
    if (!ad) return res.status(404).json({ error: "Oglas nije pronađen" });
    res.json({ message: "Oglas je postavljen kao premium", ad });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Greška servera" });
  }
});

export default router;
