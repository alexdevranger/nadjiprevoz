import mongoose from "mongoose";

const shipmentSchema = new mongoose.Schema(
  {
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    pickupLocation: { type: String, required: true }, // A
    dropoffLocation: { type: String }, // B (opciono)
    date: { type: Date, required: true }, // datum kada treba da se izvrsi
    weightKg: { type: Number, required: true }, // tezina u kg
    pallets: { type: Number, default: 0 }, // broj paletnih mesta
    dimensions: {
      length: { type: Number }, // cm
      width: { type: Number }, // cm
      height: { type: Number }, // cm
    },
    goodsType: { type: String }, // vrsta robe (opciono)
    note: { type: String },
    contactPhone: { type: String }, // opciono
    distanceMeters: { type: Number },
    durationSec: { type: Number },
    isPremium: {
      type: Boolean,
      default: false, // po defaultu nije premium
    },
    premiumStatus: {
      type: String,
      enum: ["none", "pending", "approved", "rejected"],
      default: "none",
    },
    premiumExpiresAt: {
      type: Date,
      default: null, // nema isteka dok se ne kupi
    },
  },
  { timestamps: true }
);

export default mongoose.model("Shipment", shipmentSchema);
