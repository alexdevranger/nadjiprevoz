import mongoose from "mongoose";

const driverPortfolioSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    // Dodajte slug za jedinstveni URL
    slug: {
      type: String,
      unique: true,
      sparse: true,
    },
    profileImage: {
      type: String,
      default: "",
    },
    // Dodajte kontakt informacije
    contactInfo: {
      phone: String,
      email: String,
    },
    // Dodajte vozila iz "Moja vozila"
    vehicles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Vehicle",
      },
    ],
    yearsOfExperience: {
      type: Number,
      required: true,
      min: 0,
    },
    // Izbacili smo vehicleType jer će se koristiti vozila iz "Moja vozila"
    licenseCategories: [
      {
        type: String,
        enum: ["B", "C", "C1", "C+E", "D", "D1"],
      },
    ],
    previousExperience: [
      {
        companyName: String,
        position: String,
        startDate: Date,
        endDate: Date,
        description: String,
        current: {
          type: Boolean,
          default: false,
        },
      },
    ],
    skills: [String],
    languages: [
      {
        language: String,
        level: {
          type: String,
          enum: ["osnovni", "srednji", "napredni", "maternji"],
        },
      },
    ],
    availability: {
      type: String,
      enum: ["dostupan", "zauzet", "uskoro_dostupan"],
      default: "dostupan",
    },
    preferredJobTypes: [String],
    salaryExpectation: {
      type: Number,
    },
    aboutMe: {
      type: String,
      maxlength: 1000,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    hasPaidPortfolio: {
      type: Boolean,
      default: false,
    },
    // Statistike pregleda
    viewCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model("DriverPortfolio", driverPortfolioSchema);
