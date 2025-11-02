// routes/globalChat.js
import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import GlobalChatMessage from "../models/GlobalChatMessage.js";

const router = express.Router();

// GET poslednjih 50 poruka
router.get("/", authMiddleware, async (req, res) => {
  try {
    const messages = await GlobalChatMessage.find()
      .sort({ createdAt: -1 })
      .limit(50)
      .populate("user", "name company profileImage");
    res.json(messages.reverse());
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Greška pri učitavanju poruka" });
  }
});

// POST nova poruka
router.post("/", authMiddleware, async (req, res) => {
  const { content } = req.body;

  if (!content) return res.status(400).json({ message: "Content is required" });

  try {
    const newMsg = await GlobalChatMessage.create({
      user: req.user._id, // uzimamo iz authMiddleware
      content,
    });

    await newMsg.populate("user", "name company profileImage");

    if (global.io) {
      global.io.emit("receiveGlobalMessage", newMsg);
    }

    res.status(201).json(newMsg);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});
// router.post("/", authMiddleware, async (req, res) => {
//   try {
//     const { content } = req.body;
//     if (!content || !content.trim())
//       return res.status(400).json({ error: "Poruka je prazna" });

//     const message = new GlobalChatMessage({
//       user: req.user.id,
//       content,
//     });
//     await message.save();
//     const populatedMessage = await message.populate(
//       "user",
//       "name company profileImage"
//     );
//     res.status(201).json(populatedMessage);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Greška pri slanju poruke" });
//   }
// });

export default router;
