// backend/routes/messages.js
import express from "express";
import Message from "../models/Message.js";
import Conversation from "../models/Conversation.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { io } from "../server.js";

const router = express.Router();

// BULK slanje poruka
router.post("/bulk", authMiddleware, async (req, res) => {
  try {
    const { messages } = req.body;
    const senderId = req.user.id;

    console.log("📥 /api/messages/bulk:", messages);
    console.log("📥 senderId:", senderId);

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "Nema poruka za slanje" });
    }

    const results = [];

    for (const { recipientId, text, tourId } of messages) {
      if (!recipientId || !text) continue;

      // 1. Nađi ili kreiraj konverzaciju
      let conv = await Conversation.findOne({
        participants: { $all: [senderId, recipientId] },
        tourId: tourId || null,
      });
      console.log(
        "🔍 Pronađena konverzacija:",
        conv ? conv._id : "Nije pronađena, kreiraćemo novu"
      );

      if (!conv) {
        conv = await Conversation.create({
          participants: [senderId, recipientId],
          tourId: tourId || null,
          lastMessage: null,
          unread: { [recipientId]: 0, [senderId]: 0 },
        });
        console.log("🆕 Kreirana nova konverzacija:", {
          _id: conv._id,
          participants: conv.participants,
          tourId: conv.tourId,
        });
      }

      // 2. Kreiraj poruku
      const msg = await Message.create({
        conversationId: conv._id,
        senderId,
        text,
      });
      console.log("💬 Kreirana poruka:", {
        _id: msg._id,
        text: msg.text.substring(0, 50) + (msg.text.length > 50 ? "..." : ""),
        createdAt: msg.createdAt,
      });

      // 3. Ažuriraj conv.lastMessage i unread mapu
      if (!(conv.unread instanceof Map)) {
        const m = new Map();
        Object.entries(conv.unread || {}).forEach(([k, v]) => m.set(k, v));
        conv.unread = m;
      }

      conv.lastMessage = { text, senderId, createdAt: msg.createdAt };

      const receiverId = conv.participants.find(
        (p) => p.toString() !== senderId
      );
      console.log("receiverId:", receiverId);

      if (receiverId) {
        conv.unread.set(
          receiverId.toString(),
          (conv.unread.get(receiverId.toString()) || 0) + 1
        );
        console.log("🔔 Postavljen unread za primaoca:", {
          receiverId,
          unreadCount: conv.unread.get(receiverId.toString()),
        });

        // pošalji samo primaocu personalno
        io.to(receiverId.toString()).emit("newMessage", {
          conversationId: conv._id.toString(),
          text: msg.text,
          from: senderId,
          createdAt: msg.createdAt,
        });
        console.log("📨 Emitovan newMessage primaocu:", receiverId);
      }

      const savedConv = await conv.save();
      console.log("💾 Sačuvana konverzacija:", {
        _id: savedConv._id,
        lastMessage: savedConv.lastMessage,
        unread: Object.fromEntries(savedConv.unread),
        updatedAt: savedConv.updatedAt,
      });

      // emituj i u sobu konverzacije
      io.to(conv._id.toString()).emit("newMessage", msg);
      console.log("📨 Emitovan newMessage u sobu konverzacije:", conv._id);

      // populate participants, pa conversationUpdated
      await conv.populate("participants", "name company");
      const convObj = conv.toObject();
      console.log("convObj:", convObj);
      convObj.unread = {};
      conv.unread.forEach((val, key) => {
        convObj.unread[key] = val;
      });
      console.log(
        "🔄 Emitujem conversationUpdated za učesnike:",
        conv.participants.map((p) => p._id)
      );
      conv.participants.forEach((pId) => {
        io.to(pId.toString()).emit("conversationUpdated", convObj);
      });

      results.push({ conversationId: conv._id, message: msg });
    }
    console.log("✅ /api/messages/bulk:", results);

    res.json({ success: true, results });
  } catch (err) {
    console.error("❌ Greška /api/messages/bulk:", err);
    res.status(500).json({ error: "Greška pri slanju poruka" });
  }
});

router.post("/", authMiddleware, async (req, res) => {
  try {
    const { conversationId, text } = req.body;
    const senderId = req.user.id;
    const msg = await Message.create({ conversationId, senderId, text });

    const conv = await Conversation.findById(conversationId);
    if (conv) {
      // ensure Map
      if (!(conv.unread instanceof Map)) {
        const m = new Map();
        Object.entries(conv.unread || {}).forEach(([k, v]) => m.set(k, v));
        conv.unread = m;
      }

      conv.lastMessage = { text, senderId, createdAt: msg.createdAt };

      const receiverId = conv.participants.find(
        (p) => p.toString() !== senderId
      );
      if (receiverId) {
        conv.unread.set(
          receiverId.toString(),
          (conv.unread.get(receiverId.toString()) || 0) + 1
        );
        // emit only to that receiver personal room (if connected)
        io.to(receiverId.toString()).emit("newMessage", {
          conversationId,
          text: msg.text,
          from: senderId,
          createdAt: msg.createdAt,
        });
      }

      await conv.save();

      // emit newMessage to conversation room also (so open chat gets it)
      io.to(conversationId.toString()).emit("newMessage", msg);

      // populate and convert, emit conversationUpdated to participants
      await conv.populate("participants", "name company");
      const convObj = conv.toObject();
      convObj.unread = {};
      conv.unread.forEach((val, key) => {
        convObj.unread[key] = val;
      });
      conv.participants.forEach((pId) => {
        io.to(pId.toString()).emit("conversationUpdated", convObj);
      });
    }

    res.status(201).json(msg);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not send message" });
  }
});

// GET /api/messages/:conversationId -> history (paginated if needed)
router.get("/:conversationId", authMiddleware, async (req, res) => {
  try {
    const { conversationId } = req.params;
    const messages = await Message.find({ conversationId }).sort({
      createdAt: 1,
    });
    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not load messages" });
  }
});

export default router;
