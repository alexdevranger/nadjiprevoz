import express from "express";
import User from "../models/User.js";
import Tour from "../models/Tour.js";
import Shipment from "../models/Shipment.js";
import Message from "../models/Message.js";
import { adminAuthMiddleware } from "../middleware/adminAuthMiddleware.js";

const router = express.Router();

router.get("/users", adminAuthMiddleware, async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Greška prilikom učitavanja korisnika" });
  }
});

// GET user by ID
router.get("/users/:id", adminAuthMiddleware, async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: "Korisnik nije pronađen" });
  res.json(user);
});

// GET tours by user
router.get("/users/:id/tours", adminAuthMiddleware, async (req, res) => {
  const tours = await Tour.find({ createdBy: req.params.id })
    .populate("vehicle")
    .exec(); // prilagodi model
  res.json(tours);
});

// GET shipments by user
router.get("/users/:id/shipments", adminAuthMiddleware, async (req, res) => {
  const shipments = await Shipment.find({ createdBy: req.params.id });
  res.json(shipments);
});

// GET messages by user
router.get("/users/:id/messages", adminAuthMiddleware, async (req, res) => {
  const messages = await Message.find({ senderId: req.params.id });
  res.json(messages);
});

router.post("/ban/:id", adminAuthMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "Korisnik ne postoji" });

    user.banned = true;
    await user.save();

    res.json({ message: "Korisnik je banovan" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Greška prilikom banovanja" });
  }
});

router.post("/unban/:id", adminAuthMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "Korisnik ne postoji" });

    user.banned = false;
    await user.save();

    res.json({ message: "Korisnik je odblokiran" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Greška prilikom odblokiranja" });
  }
});

export default router;
