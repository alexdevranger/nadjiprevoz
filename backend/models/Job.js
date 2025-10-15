import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    position: {
      type: String,
      required: true,
      trim: true,
    },
    location: [
      {
        type: String,
        required: true,
      },
    ],
    salary: {
      type: String,
      required: false,
    },
    contact: {
      email: String,
      phone: String,
      person: String,
    },
    employmentType: {
      type: String,
      enum: [
        "Puno radno vreme",
        "Skraćeno radno vreme",
        "Ugovor",
        "Praksa",
        "Privremeno",
      ],
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    requirements: [
      {
        type: String,
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
      required: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    status: {
      type: String,
      enum: ["aktivan", "pauziran", "arhiviran"],
      default: "aktivan",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Job", jobSchema);
