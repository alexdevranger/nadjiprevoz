// routes/geocodeRoutes.js
import express from "express";
import axios from "axios";
import { geocode } from "../utils/geo.js";

const geocodeRouter = express.Router();

geocodeRouter.get("/", async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) return res.status(400).json({ error: "query required" });

    // const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
    //   query
    // )}`;
    // const url = `https://nominatim.openstreetmap.org/search?format=json&countrycodes=rs&accept-language=sr&limit=1&q=${encodeURIComponent(
    //   query
    // )}`;

    // console.log(" url", url);
    // const r = await axios.get(url, {
    //   headers: { "User-Agent": "TransportApp" },
    // });

    // if (!r.data.length)
    //   return res.status(404).json({ error: "No location found" });

    const loc = await geocode(query);
    if (!loc) return res.status(404).json({ error: "No location found" });

    res.json(loc);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Geocoding error" });
  }
});

export default geocodeRouter;
