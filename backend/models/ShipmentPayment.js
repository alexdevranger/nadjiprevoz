import mongoose from "mongoose";

const paymentShipmentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    shipment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shipment",
      required: true,
    },
    amount: { type: Number, required: true, default: 2000 }, // cena u RSD
    referenceNumber: { type: String, required: true, unique: true }, // poziv na broj
    status: {
      type: String,
      enum: ["pending", "paid", "rejected"],
      default: "pending",
    },
    paymentDate: { type: Date }, // dodato - datum kada je uplata potvrđena
    adminNotes: { type: String, default: "" },
    premiumExpiresAt: { type: Date }, // kad uplata prodje
  },
  { timestamps: true }
);

export default mongoose.model("ShipmentPayment", paymentShipmentSchema);
