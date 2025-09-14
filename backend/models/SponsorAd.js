import mongoose from "mongoose";

const sponsorAdSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    image: { type: String, required: true }, // URL slike banera
    link: { type: String }, // link ka sajtu
    position: {
      type: String,
      enum: ["homepage-top", "homepage-sidebar", "search-top"],
      default: "homepage-sidebar",
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    status: { type: String, enum: ["active", "expired"], default: "active" },
  },
  { timestamps: true }
);

export default mongoose.model("SponsorAd", sponsorAdSchema);
