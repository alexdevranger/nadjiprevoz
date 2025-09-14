import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    tour: { type: mongoose.Schema.Types.ObjectId, ref: "Tour", required: true },
    amount: { type: Number, required: true, default: 2000 }, // cena u RSD
    referenceNumber: { type: String, required: true, unique: true }, // poziv na broj
    status: {
      type: String,
      enum: ["pending", "paid", "rejected"],
      default: "pending",
    },
    premiumExpiresAt: { type: Date }, // kad uplata prodje
  },
  { timestamps: true }
);

export default mongoose.model("Payment", paymentSchema);
