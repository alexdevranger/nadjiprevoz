import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: { type: String, required: true }, // npr. kamion, kombi
    capacity: { type: Number, required: true }, // nosivost u kg
    licensePlate: { type: String, required: true }, // registracija
    year: { type: Number },
    description: { type: String },
    pallets: { type: Number, default: 0 }, // broj paletnih mesta
    dimensions: {
      length: { type: Number }, // cm
      width: { type: Number }, // cm
      height: { type: Number }, // cm
    },
    image1: { type: String }, // URL prve slike
    image2: { type: String }, // URL druge slike
  },
  { timestamps: true }
);

export default mongoose.model("Vehicle", vehicleSchema);
