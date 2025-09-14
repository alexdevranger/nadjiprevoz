import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    company: { type: String }, // naziv firme ako ima
    hasCompany: { type: Boolean, default: false }, // checkbox "Imam firmu"
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    roles: { type: [String], default: ["customer"] }, // npr. "customer", "transporter"
    banned: { type: Boolean, default: false },
    profileImage: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", userSchema);
