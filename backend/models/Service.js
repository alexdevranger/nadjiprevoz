import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    serviceName: { type: String, required: true }, // npr. "AutoBole"
    type: { type: String, required: true }, // npr. "automehanicar"
    city: { type: String, required: true },
    banner: { type: String }, // URL bannera (Cloudinary)
    adresa: { type: String }, // adresa: "Volgina 23"
    telefon1: { type: String }, // telefon1
    telefon2: { type: String }, // telefon2 (opciono)
    // Lokacija može biti jednostavno lat/lng, dovoljno za prikaz na mapi
    lokacija: {
      lat: { type: Number },
      lng: { type: Number },
    },
    // eventualno dodatna polja
    description: { type: String },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Service", serviceSchema);
