// backend/models/Conversation.js
import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    tourId: { type: mongoose.Schema.Types.ObjectId, ref: "Tour" }, // optional: konverzacija vezana za turu
    shipmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Shipment" },
    participants: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    ], // length 2 (buyer, owner)
    lastMessage: {
      text: String,
      senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      createdAt: Date,
    },
    unread: {
      // map userId -> number
      type: Map,
      of: Number,
      default: {},
    },
  },
  { timestamps: true }
);

conversationSchema.index({ participants: 1 }); // olakšava pretragu
conversationSchema.index({ tourId: 1 }); // DODATO: indeks za turu
conversationSchema.index({ shipmentId: 1 }); // DODATO: indeks za zahtev

export default mongoose.model("Conversation", conversationSchema);
