import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./db.js";

import authRoutes from "./routes/auth.js";
import osmrRoutes from "./routes/osmrRouter.js";
import vehicleRoutes from "./routes/vehicleRoutes.js";
import tourRoutes from "./routes/tourRoutes.js";
import shipmentRoutes from "./routes/shipmentRoutes.js";
import geocodeRouter from "./routes/geocodeRoutes.js";
import conversationsRoutes from "./routes/conversations.js";
import messagesRoutes from "./routes/messages.js";
import aiagentRoutes from "./routes/aiagentRoutes.js";
import offersRoutes from "./routes/offers.js";
import adminRoutes from "./routes/adminRoutes.js";
import adsRoutes from "./routes/ads.js";
import adminSponsorAds from "./routes/adminSponsorAds.js";
import adminSettingsRoutes from "./routes/adminSettings.js";
import paymentsRoutes from "./routes/payments.js";
import imagesRoutes from "./routes/imagesRoutes.js";
import shopRouter from "./routes/shopRouter.js";
import Message from "./models/Message.js";
import Conversation from "./models/Conversation.js";
import webpush from "web-push";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 4000;
const dbURL =
  process.env.MONGO_URI || "mongodb://localhost:27017/transport-app-v5";
connectDB(dbURL);

// HTTP server (da Socket.io radi uz Express)
const server = http.createServer(app);

export const io = new Server(server, {
  cors: { origin: "*", credentials: true },
});

io.on("connection", (socket) => {
  console.log("socket connected:", socket.id);

  // 1️⃣ Kad se korisnik uloguje — pridruži ga sobi sa njegovim ID-jem
  socket.on("registerUser", (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined personal room`);
  });
  // 2️⃣ Kad otvori chat — pridruži ga sobi konverzacije
  socket.on("joinRoom", (conversationId) => {
    socket.join(conversationId);
    console.log(`Socket ${socket.id} joined room ${conversationId}`);
  });

  socket.on("leaveRoom", (conversationId) => {
    socket.leave(conversationId);
  });

  socket.on("offerNotification", (payload) => {
    // npr. prikaži toast, badge, ili otvori modal
    console.log("Nova obaveštenja:", payload);
  });

  socket.on("sendMessage", async (data) => {
    const { conversationId, senderId, text } = data;
    try {
      const message = await Message.create({ conversationId, senderId, text });

      const conversation = await Conversation.findById(conversationId);
      if (!conversation) return;

      // ako unread nije Map (iz nekog razloga), konvertuj iz object-a
      if (!(conversation.unread instanceof Map)) {
        const m = new Map();
        Object.entries(conversation.unread || {}).forEach(([k, v]) =>
          m.set(k, v)
        );
        conversation.unread = m;
      }

      // povecaj unread za sve osim pošiljaoca
      conversation.participants.forEach((pId) => {
        const idStr = pId.toString();
        if (idStr !== senderId.toString()) {
          const prev = conversation.unread.get(idStr) || 0;
          conversation.unread.set(idStr, prev + 1);
        }
      });

      // update lastMessage
      conversation.lastMessage = {
        text,
        senderId,
        createdAt: message.createdAt || new Date(),
      };
      await conversation.save();

      // emituj novu poruku u sobi konverzacije
      io.to(conversationId.toString()).emit("newMessage", message);

      // populate i konvertuj unread Map u plain object pre slanja
      await conversation.populate("participants", "name company");
      const convObj = conversation.toObject();
      convObj.unread = {};
      conversation.unread.forEach((val, key) => {
        convObj.unread[key] = val;
      });

      // emituj conversationUpdated u PERSONALNE sobe svakog učesnika
      conversation.participants.forEach((pId) => {
        io.to(pId.toString()).emit("conversationUpdated", convObj);
      });
    } catch (err) {
      console.error("Greška u sendMessage:", err);
    }
  });

  socket.on("markRead", async ({ conversationId, userId }) => {
    try {
      const conversation = await Conversation.findById(conversationId);
      if (!conversation) return;

      if (!(conversation.unread instanceof Map)) {
        const m = new Map();
        Object.entries(conversation.unread || {}).forEach(([k, v]) =>
          m.set(k, v)
        );
        conversation.unread = m;
      }

      conversation.unread.set(userId.toString(), 0);
      await conversation.save();

      await conversation.populate("participants", "name company");
      const convObj = conversation.toObject();
      convObj.unread = {};
      conversation.unread.forEach((val, key) => {
        convObj.unread[key] = val;
      });

      conversation.participants.forEach((pId) => {
        io.to(pId.toString()).emit("conversationUpdated", convObj);
      });
    } catch (err) {
      console.error("Greška u markRead:", err);
    }
  });

  socket.on("disconnect", () => {
    console.log("socket disconnected:", socket.id);
  });
});

// VAPID ključevi (napravi jednom)
webpush.setVapidDetails(
  "mailto:you@example.com",
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

// Čuvamo pretplate u memoriji (za demo)
let subscriptions = [];

// Endpoint za registraciju push pretplate
app.post("/subscribe", (req, res) => {
  const subscription = req.body;
  subscriptions.push(subscription);
  res.status(201).json({});
});

// Endpoint za slanje push notifikacije
app.post("/send-notification", (req, res) => {
  const { title, message } = req.body;

  const payload = JSON.stringify({ title, message });

  subscriptions.forEach((sub) => {
    webpush.sendNotification(sub, payload).catch((err) => console.error(err));
  });

  res.status(200).json({ message: "Notifications sent" });
});

app.use("/api/auth", authRoutes);
app.use("/api/route", osmrRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/tours", tourRoutes);
app.use("/api/shipments", shipmentRoutes);
app.use("/api/geocode", geocodeRouter);
app.use("/api/conversations", conversationsRoutes);
app.use("/api/messages", messagesRoutes);
app.use("/api/agent", aiagentRoutes);
app.use("/api/offers", offersRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/settings", adminSettingsRoutes);
app.use("/api/ads", adsRoutes);
app.use("/api/sponsor-ads", adminSponsorAds);
app.use("/api/payments", paymentsRoutes);
app.use("/api/images", imagesRoutes);
app.use("/api/shop", shopRouter);

server.listen(port, () => console.log(`Backend listening on ${port}`));
