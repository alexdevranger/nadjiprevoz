import mongoose from "mongoose";

const jobApplicationSchema = new mongoose.Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    applicantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    transporterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: String,
      maxlength: 1000,
    },
    cvUrl: {
      type: String,
    },
    // Novi podaci iz portfolija
    applicantData: {
      name: String,
      email: String,
      phone: String,
      yearsOfExperience: Number,
      hasOwnVehicle: Boolean,
      vehicleType: String,
      previousExperience: [
        {
          companyName: String,
          position: String,
          duration: String,
        },
      ],
      skills: [String],
      portfolioData: {
        type: Boolean,
        default: false,
      },
    },
    status: {
      type: String,
      enum: ["na čekanju", "u užem izboru", "odbijen", "prihvaćen"],
      default: "na čekanju",
    },
    archived: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("JobApplication", jobApplicationSchema);
