import mongoose from "mongoose";

const companyReviewSchema = new mongoose.Schema(
  {
    applicantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
      required: true,
    },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String, default: "", maxlength: 1000 },
  },
  { timestamps: true }
);

// ✅ svaki kandidat može oceniti istu firmu samo jednom
companyReviewSchema.index({ applicantId: 1, companyId: 1 }, { unique: true });

export default mongoose.model("CompanyReview", companyReviewSchema);
