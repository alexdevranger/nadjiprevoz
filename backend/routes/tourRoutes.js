import express from "express";
import Tour from "../models/Tour.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { adminAuthMiddleware } from "../middleware/adminAuthMiddleware.js";

const tourRouter = express.Router();

// Kreiranje nove ture
tourRouter.post("/", authMiddleware, async (req, res) => {
  try {
    const {
      date,
      startLocation,
      endLocation,
      note,
      vehicle,
      contactPerson,
      contactPhone,
      startLocationLat,
      startLocationLng,
      endLocationLat,
      endLocationLng,
      startPoint,
      endPoint,
    } = req.body;
    const newTour = new Tour({
      date,
      startLocation,
      endLocation,
      note,
      vehicle,
      contactPerson,
      contactPhone,
      startLocationLat: startLocationLat || null,
      startLocationLng: startLocationLng || null,
      endLocationLat: endLocationLat || null,
      endLocationLng: endLocationLng || null,
      startPoint: startPoint || {
        type: "Point",
        coordinates: [0, 0],
      },
      endPoint: endPoint || {
        type: "Point",
        coordinates: [0, 0],
      },
      createdBy: req.user.id,
    });
    await newTour.save();
    res.json(newTour);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Greška pri kreiranju ture" });
  }
});

// Dobavljanje svih tura za odabrani datum
tourRouter.get("/date", async (req, res) => {
  try {
    const filter = {};
    const { date } = req.query;

    if (date) {
      const selectedDate = new Date(date);
      const nextDay = new Date(selectedDate);
      nextDay.setDate(nextDay.getDate() + 1);
      filter.date = { $gte: selectedDate, $lt: nextDay };
    }

    const tours = await Tour.find(filter)
      .populate("vehicle", "name") // samo ime vozila
      .populate("createdBy", "name");

    res.json(tours);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Greška pri dobavljanju tura" });
  }
});

// Dobavljanje tura za ulogovanog korisnika (opciono po datumu i filterima)
tourRouter.get("/my-tours", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { date, vehicleType, minCapacity, startLocation } = req.query;

    // osnovni filter po vlasniku
    let filter = { createdBy: userId };

    if (date) {
      const selectedDate = new Date(date);
      const nextDay = new Date(selectedDate);
      nextDay.setDate(nextDay.getDate() + 1);
      filter.date = { $gte: selectedDate, $lt: nextDay };
    }

    if (startLocation) {
      filter.startLocation = { $regex: startLocation, $options: "i" };
    }

    // prvo dohvatimo ture koje su CREATED BY userId i (opciono) po datumu/startLocation
    let tours = await Tour.find(filter)
      .sort({ date: 1 })
      .populate("vehicle", "type licensePlate capacity") // isto kao u AllTours
      .populate("createdBy", "username name");

    // dodatni filteri koji se lakše rade u memoriji (po tipu vozila i kapacitetu)
    if (vehicleType) {
      tours = tours.filter((t) => t.vehicle && t.vehicle.type === vehicleType);
    }
    if (minCapacity) {
      tours = tours.filter(
        (t) => t.vehicle && Number(t.vehicle.capacity) >= Number(minCapacity)
      );
    }

    res.json(tours);
  } catch (err) {
    console.error("Error GET /my-tours:", err);
    res.status(500).json({ error: "Greška pri dobavljanju vaših tura" });
  }
});

// GET /api/tours/premium
tourRouter.get("/premium", adminAuthMiddleware, async (req, res) => {
  try {
    const today = new Date();
    const tours = await Tour.find({
      isPremium: true,
      premiumExpiresAt: { $gte: today },
    })
      .populate("createdBy")
      .sort({ premiumExpiresAt: -1 });

    res.json(tours);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Greška na serveru" });
  }
});

// Dobavljanje jedne ture po ID-u
tourRouter.get("/:id", async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id).populate(
      "vehicle createdBy",
      "name model registration username"
    );
    res.json(tour);
  } catch (err) {
    res.status(500).json({ error: "Greška pri dobavljanju ture" });
  }
});

// Izmena ture po ID-u
tourRouter.put("/:id", authMiddleware, async (req, res) => {
  try {
    const tour = await Tour.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user.id },
      req.body,
      { new: true }
    );
    if (!tour) return res.status(404).json({ message: "Tura nije pronađena" });
    res.json(tour);
  } catch (err) {
    res.status(500).json({ message: "Greška prilikom izmene ture" });
  }
});

// Brisanje ture (samo vlasnik)
tourRouter.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const tour = await Tour.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user.id,
    });
    if (!tour) return res.status(404).json({ message: "Tura nije pronađena" });
    res.json({ message: "Tura obrisana" });
  } catch (err) {
    res.status(500).json({ message: "Greška pri brisanju ture" });
  }
});

// tourRouter.js (ili gde ti je tour router)
tourRouter.get("/", async (req, res) => {
  try {
    const { date, vehicleType, minCapacity, startLocation } = req.query;
    let filter = {};

    if (date) {
      const selectedDate = new Date(date);
      const nextDay = new Date(selectedDate);
      nextDay.setDate(nextDay.getDate() + 1);
      filter.date = { $gte: selectedDate, $lt: nextDay };
    }

    if (startLocation) {
      filter.startLocation = { $regex: startLocation, $options: "i" };
    }

    // Nađi sve ture i onda filtriraj po tipu vozila u memoriji
    let tours = await Tour.find(filter)
      .sort({ date: 1 })
      .populate("vehicle", "type licensePlate capacity")
      .populate("createdBy", "username name");

    if (vehicleType) {
      tours = tours.filter((t) => t.vehicle && t.vehicle.type === vehicleType);
    }

    if (minCapacity) {
      tours = tours.filter(
        (t) => t.vehicle && t.vehicle.capacity >= Number(minCapacity)
      );
    }

    res.json(tours);
  } catch (err) {
    res.status(500).json({ error: "Greška pri dobavljanju tura" });
  }
});

export default tourRouter;
