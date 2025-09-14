import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  icon: { type: String }, // Može da sadrži naziv ikonice (npr. "FaTruck")
});

const shopSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    companyName: {
      type: String,
      required: true,
    },
    address: {
      street: String,
      city: String,
      country: String,
      zipCode: String,
    },
    logo: {
      type: String, // URL do logoa
    },
    description: {
      type: String,
    },
    specialization: {
      type: String,
    },
    services: [serviceSchema],
    contact: {
      phone: String,
      email: String,
      website: String,
    },
    socialMedia: {
      facebook: String,
      instagram: String,
      linkedin: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    vehicles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Vehicle",
      },
    ],
  },
  { timestamps: true }
);

// Middleware za automatsko generisanje sluga pre snimanja
shopSchema.pre("save", function (next) {
  if (this.isModified("name") && !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  }
  next();
});

export default mongoose.model("Shop", shopSchema);
