import mongoose from "mongoose";

const adSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    currency: { type: String, default: "RSD" },
    type: { type: String, enum: ["offer", "request"], required: true },
    // "offer" = prevoznik, "request" = klijent
    origin: String,
    destination: String,
    weight: Number, // samo kod request
    vehicle: String, // samo kod offer
    price: Number,
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: {
      type: String,
      enum: [
        "pending",
        "approved",
        "rejected",
        "active",
        "expired",
        "archived",
      ],
      default: "pending",
    },
    isPremium: { type: Boolean, default: false },
    premiumExpiresAt: { type: Date },
    createdAt: { type: Date, default: Date.now },
    expiresAt: { type: Date },
    category: { type: String },
    location: { type: String },
  },
  { timestamps: true }
);

// Pre-save hook – automatski postavi expiresAt ako nije unet
adSchema.pre("save", function (next) {
  if (!this.expiresAt) {
    const days = 30; // default
    this.expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
  }
  next();
});

export default mongoose.model("Ad", adSchema);
