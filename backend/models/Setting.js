import mongoose from "mongoose";

const SettingSchema = new mongoose.Schema(
  {
    siteName: { type: String, default: "My Portal" },
    logoUrl: { type: String, default: "" },
    language: { type: String, default: "sr" }, // sr, en
    currency: { type: String, default: "RSD" },

    maxFreeAds: { type: Number, default: 3 },
    adPrice: { type: Number, default: 0 }, // ako je free, 0
    adDurationDays: { type: Number, default: 30 },

    aiEnabled: { type: Boolean, default: false },
    aiMaxResults: { type: Number, default: 10 },
  },
  { timestamps: true }
);

export default mongoose.model("Setting", SettingSchema);
