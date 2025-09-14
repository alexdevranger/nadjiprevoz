import express from "express";
import Setting from "../models/Setting.js";
import { adminAuthMiddleware } from "../middleware/adminAuthMiddleware.js";

const router = express.Router();

// GET settings
router.get("/", adminAuthMiddleware, async (req, res) => {
  try {
    let settings = await Setting.findOne();
    if (!settings) {
      settings = await Setting.create({}); // inicijalizuj ako ne postoji
    }
    res.json(settings);
  } catch (err) {
    res.status(500).json({ error: "Greška pri učitavanju podešavanja" });
  }
});

// UPDATE settings
router.put("/", adminAuthMiddleware, async (req, res) => {
  try {
    let settings = await Setting.findOne();
    if (!settings) {
      settings = await Setting.create(req.body);
    } else {
      Object.assign(settings, req.body);
      await settings.save();
    }
    res.json(settings);
  } catch (err) {
    res.status(500).json({ error: "Greška pri čuvanju podešavanja" });
  }
});

export default router;
