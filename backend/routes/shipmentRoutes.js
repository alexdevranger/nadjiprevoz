import express from "express";
import Shipment from "../models/Shipment.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const shipmentRouter = express.Router();

// Create shipment
shipmentRouter.post("/", authMiddleware, async (req, res) => {
  try {
    const {
      pickupLocation,
      dropoffLocation,
      date,
      weightKg,
      pallets,
      dimensions,
      goodsType,
      note,
      contactPhone,
      distanceMeters,
      durationSec,
    } = req.body;

    if (!pickupLocation || !date || !weightKg) {
      return res
        .status(400)
        .json({ error: "pickupLocation, date i weightKg su obavezni" });
    }

    const shipment = new Shipment({
      createdBy: req.user.id,
      pickupLocation,
      dropoffLocation,
      date,
      weightKg,
      pallets: pallets || 0,
      dimensions: dimensions || {},
      goodsType,
      note,
      contactPhone,
      distanceMeters: distanceMeters || null,
      durationSec: durationSec || null,
    });

    await shipment.save();
    res.status(201).json(shipment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Greška pri kreiranju zahteva" });
  }
});

// shipmentRouter.get("/myshipments", authMiddleware, async (req, res) => {
//   try {
//     if (!req.user) return res.status(401).json({ error: "Unauthorized" });

//     // podrška za oba polja (id ili _id) u slučaju različitih middleware-a
//     const userId = req.user.id || req.user._id || req.user;

//     console.log("MysShipments for user:", userId);

//     const shipments = await Shipment.find({ createdBy: userId }).sort({
//       createdAt: -1,
//     });
//     console.log("Found shipments:", shipments);

//     return res.json(shipments);
//   } catch (err) {
//     console.error("Error /myshipments:", err);
//     return res
//       .status(500)
//       .json({ error: "Greška pri dohvatanju vaših zahteva" });
//   }
// });
shipmentRouter.get("/myshipments", authMiddleware, async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });

    const userId = req.user.id || req.user._id || req.user;
    const { date, pickupLocation } = req.query;

    const filter = { createdBy: userId };

    if (date) {
      const d = new Date(date);
      const next = new Date(d);
      next.setDate(next.getDate() + 1);
      filter.date = { $gte: d, $lt: next };
    }

    if (pickupLocation) {
      filter.pickupLocation = { $regex: pickupLocation, $options: "i" };
    }

    const shipments = await Shipment.find(filter)
      .sort({ date: 1 })
      .populate("createdBy", "name company email");

    return res.json(shipments);
  } catch (err) {
    console.error("Error /myshipments:", err);
    return res
      .status(500)
      .json({ error: "Greška pri dohvatanju vaših zahteva" });
  }
});

// Get all shipments with optional filters (date, minWeight, pickupLocation)
shipmentRouter.get("/", async (req, res) => {
  try {
    const { date, minWeight, pickupLocation, goodsType } = req.query;
    const filter = {};

    if (date) {
      // const d = parseLocalDate(date);
      const d = date;
      const next = new Date(d);
      next.setDate(next.getDate() + 1);
      filter.date = { $gte: d, $lt: next };
    }

    if (minWeight) filter.weightKg = { $gte: Number(minWeight) };
    if (pickupLocation)
      filter.pickupLocation = { $regex: pickupLocation, $options: "i" };
    if (goodsType) filter.goodsType = { $regex: goodsType, $options: "i" };

    const shipments = await Shipment.find(filter)
      .sort({ date: 1 })
      .populate("createdBy", "name company email");
    res.json(shipments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Greška pri dohvatanju zahteva" });
  }
});

// Get single shipment
shipmentRouter.get("/:id", async (req, res) => {
  try {
    const s = await Shipment.findById(req.params.id).populate(
      "createdBy",
      "name company email"
    );
    if (!s) return res.status(404).json({ error: "Zahtev nije pronađen" });
    res.json(s);
  } catch (err) {
    res.status(500).json({ error: "Greška pri dohvatanju zahteva" });
  }
});

// Update (only owner)
shipmentRouter.put("/:id", authMiddleware, async (req, res) => {
  try {
    const s = await Shipment.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user.id },
      req.body,
      { new: true }
    );
    if (!s)
      return res
        .status(404)
        .json({ error: "Zahtev nije pronađen ili nemate pristup" });
    res.json(s);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Greška pri izmeni zahteva" });
  }
});

// Delete (only owner)
shipmentRouter.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const s = await Shipment.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user.id,
    });
    if (!s)
      return res
        .status(404)
        .json({ error: "Zahtev nije pronađen ili nemate pristup" });
    res.json({ message: "Zahtev obrisan" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Greška pri brisanju zahteva" });
  }
});

export default shipmentRouter;
