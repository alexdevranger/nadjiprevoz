import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const osmrRouter = express.Router();

// GET /api/route?start=lng,lat&end=lng,lat
osmrRouter.get("/", async (req, res) => {
  try {
    const { start, end } = req.query; // expect "lng,lat"
    if (!start || !end)
      return res.status(400).json({ error: "start and end required" });

    const osrmUrl = `${process.env.OSRM_URL}/route/v1/driving/${start};${end}?overview=full&geometries=geojson&overview=full`;
    console.log("osrmUrl-1", osrmUrl);
    const r = await axios.get(osrmUrl);
    const route = r.data.routes && r.data.routes[0];
    if (!route) return res.status(404).json({ error: "No route" });

    res.json({
      distanceMeters: route.distance,
      durationSec: route.duration,
      geometry: route.geometry,
    });
  } catch (err) {
    console.error("Route err", err?.response?.data || err.message);
    res.status(500).json({ error: "Routing error" });
  }
});

export default osmrRouter;
