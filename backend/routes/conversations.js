// backend/routes/conversations.js
import express from "express";
import Conversation from "../models/Conversation.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// POST /api/conversations  -> create or return existing conversation for tour + participants
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { tourId, otherUserId } = req.body;
    const userId = req.user.id;

    if (userId === otherUserId) {
      return res
        .status(400)
        .json({ error: "Ne možete započeti razgovor sami sa sobom." });
    }

    // participants orderless search
    const existing = await Conversation.findOne({
      tourId: tourId || null,
      participants: { $all: [userId, otherUserId], $size: 2 },
    });

    if (existing) return res.json(existing);

    const conv = new Conversation({
      tourId: tourId || null,
      participants: [userId, otherUserId],
      unread: { [otherUserId]: 0, [userId]: 0 },
    });
    await conv.save();
    res.status(201).json(conv);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not create conversation" });
  }
});
router.post("/shipment", authMiddleware, async (req, res) => {
  try {
    const { shipmentId, otherUserId } = req.body;
    const userId = req.user.id;

    if (userId === otherUserId) {
      return res
        .status(400)
        .json({ error: "Ne možete započeti razgovor sami sa sobom." });
    }

    // Provera da li već postoji konverzacija za ovaj shipment
    const existing = await Conversation.findOne({
      shipmentId: shipmentId || null,
      participants: { $all: [userId, otherUserId], $size: 2 },
    });

    if (existing) return res.json(existing);

    // Kreiraj novu konverzaciju za shipment
    const conv = new Conversation({
      shipmentId: shipmentId || null,
      participants: [userId, otherUserId],
      unread: { [otherUserId]: 0, [userId]: 0 },
    });

    await conv.save();
    res.status(201).json(conv);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Greška pri kreiranju konverzacije" });
  }
});
//označi kao pročitano
router.put("/:id/read", authMiddleware, async (req, res) => {
  const conv = await Conversation.findById(req.params.id);
  if (!conv) return res.status(404).json({ error: "Not found" });

  conv.unread.set(req.user.id, 0);
  await conv.save();

  res.json({ success: true });
});

router.get("/unread-count", authMiddleware, async (req, res) => {
  try {
    const conversations = await Conversation.find({
      participants: req.user.id,
    }).populate("lastMessage");

    let totalUnread = 0;
    conversations.forEach((conv) => {
      totalUnread += conv.unread.get(req.user.id) || 0;
    });

    res.json({ count: totalUnread });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/conversations  -> list conversations for logged user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const convs = await Conversation.find({ participants: userId })
      .sort({ updatedAt: -1 })
      .populate("participants", "name company")
      .populate("tourId", "startLocation endLocation date")
      .populate("shipmentId", "pickupLocation dropoffLocation date");
    res.json(convs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not list conversations" });
  }
});

export default router;
