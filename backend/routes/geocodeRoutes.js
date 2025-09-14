// routes/geocodeRoutes.js
import express from "express";
import axios from "axios";

const geocodeRouter = express.Router();

geocodeRouter.get("/", async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) return res.status(400).json({ error: "query required" });

    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      query
    )}`;
    const r = await axios.get(url, {
      headers: { "User-Agent": "TransportApp" },
    });

    if (!r.data.length)
      return res.status(404).json({ error: "No location found" });

    const loc = r.data[0]; // prvi rezultat
    res.json({
      lat: parseFloat(loc.lat),
      lon: parseFloat(loc.lon),
      display_name: loc.display_name,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Geocoding error" });
  }
});

export default geocodeRouter;
