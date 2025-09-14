import express from "express";
import SponsorAd from "../models/SponsorAd.js";
import { adminAuthMiddleware } from "../middleware/adminAuthMiddleware.js";

const router = express.Router();

// GET svi sponsor oglasi
router.get("/", adminAuthMiddleware, async (req, res) => {
  try {
    const ads = await SponsorAd.find().sort({ createdAt: -1 });
    res.json(ads);
  } catch (err) {
    res.status(500).json({ error: "Greška prilikom listanja oglasa" });
  }
});

// POST novi sponsor oglas
router.post("/", adminAuthMiddleware, async (req, res) => {
  try {
    const ad = new SponsorAd(req.body);
    await ad.save();
    res.json(ad);
  } catch (err) {
    res.status(500).json({ error: "Greška prilikom kreiranja oglasa" });
  }
});

// PUT izmena
router.put("/:id", adminAuthMiddleware, async (req, res) => {
  try {
    const ad = await SponsorAd.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(ad);
  } catch (err) {
    res.status(500).json({ error: "Greška prilikom izmene oglasa" });
  }
});

// DELETE
router.delete("/:id", adminAuthMiddleware, async (req, res) => {
  try {
    await SponsorAd.findByIdAndDelete(req.params.id);
    res.json({ message: "Sponsor oglas obrisan" });
  } catch (err) {
    res.status(500).json({ error: "Greška prilikom brisanja oglasa" });
  }
});

export default router;
