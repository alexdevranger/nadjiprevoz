import mongoose from "mongoose";

const CandidateReviewSchema = new mongoose.Schema(
  {
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
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, default: "", maxlength: 1000 },
  },
  { timestamps: true }
);

// ✅ svaki transporter može oceniti istog kandidata samo jednom
CandidateReviewSchema.index(
  { applicantId: 1, transporterId: 1 },
  { unique: true }
);

export default mongoose.model("CandidateReview", CandidateReviewSchema);
