import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import CandidateReview from "../models/CandidateReview.js";
import DriverPortfolio from "../models/DriverPortfolio.js";

const router = express.Router();

// ➕ Dodaj ili ažuriraj ocenu
// router.post("/", authMiddleware, async (req, res) => {
//   try {
//     const { applicantId, rating, comment } = req.body;
//     const transporterId = req.user.id;

//     if (!applicantId || !rating)
//       return res
//         .status(400)
//         .json({ success: false, message: "Nedostaju podaci." });

//     let existing = await CandidateReview.findOne({
//       applicantId,
//       transporterId,
//     });
//     if (existing) {
//       existing.rating = rating;
//       existing.comment = comment;
//       await existing.save();
//       return res.json({
//         success: true,
//         review: existing,
//         message: "Ocena ažurirana.",
//       });
//     }

//     const review = await CandidateReview.create({
//       applicantId,
//       transporterId,
//       rating,
//       comment,
//     });

//     res.status(201).json({ success: true, review, message: "Ocena sačuvana." });
//   } catch (err) {
//     console.error("❌ Greška u POST /candidate-reviews:", err);
//     res.status(500).json({ success: false, message: err.message });
//   }
// });
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { applicantId, rating, comment } = req.body;
    const transporterId = req.user.id;

    if (!applicantId || !rating) {
      return res
        .status(400)
        .json({ success: false, message: "Nedostaju podaci." });
    }

    // 🔹 Proveri da li postoji prethodna ocena
    let review = await CandidateReview.findOne({ applicantId, transporterId });

    if (review) {
      review.rating = rating;
      review.comment = comment;
      await review.save();
    } else {
      review = await CandidateReview.create({
        applicantId,
        transporterId,
        rating,
        comment,
      });
    }

    // 🔹 Popuni podatke kandidata i njegovog portfolija
    review = await CandidateReview.findById(review._id)
      .populate("applicantId", "name email profileImage")
      .lean();

    const portfolio = await DriverPortfolio.findOne({
      userId: review.applicantId._id,
    }).select("slug profileImage firstName lastName");

    // review.applicantId = {
    //   ...review.applicantId,
    //   portfolioSlug: portfolio?.slug || null,
    //   portfolioName: portfolio
    //     ? `${portfolio.firstName} ${portfolio.lastName}`
    //     : null,
    //   portfolioImage: portfolio?.profileImage || null,
    // };
    review.applicantId.portfolio = portfolio || null;

    res.json({
      success: true,
      review,
      message: review._id ? "Ocena ažurirana." : "Ocena sačuvana.",
    });
  } catch (err) {
    console.error("❌ Greška u POST /candidate-reviews:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});
/**
 * 🔹 Vrati sve ocene koje je transporter dao kandidatima
 */
router.get("/my", authMiddleware, async (req, res) => {
  try {
    const transporterId = req.user.id;

    let reviews = await CandidateReview.find({ transporterId })
      .populate("applicantId", "name email profileImage")
      .sort({ createdAt: -1 })
      .lean();

    // Dodaj portfolio podatke
    for (let review of reviews) {
      const portfolio = await DriverPortfolio.findOne({
        userId: review.applicantId._id,
      }).select("slug profileImage firstName lastName");

      review.applicantId = {
        ...review.applicantId,
        portfolioSlug: portfolio?.slug || null,
        portfolioName: portfolio
          ? `${portfolio.firstName} ${portfolio.lastName}`
          : null,
        portfolioImage: portfolio?.profileImage || null,
      };
    }

    res.json({ success: true, reviews });
  } catch (err) {
    console.error("❌ Greška u GET /candidate-reviews/my:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// 🔍 Učitaj ocenu za određenog kandidata
router.get("/:applicantId", authMiddleware, async (req, res) => {
  try {
    const transporterId = req.user.id;
    const { applicantId } = req.params;

    const review = await CandidateReview.findOne({
      applicantId,
      transporterId,
    });
    res.json({ success: true, review });
  } catch (err) {
    console.error("❌ Greška u GET /candidate-reviews/:applicantId:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// 📄 Sve ocene transportera (za listu)
// router.get("/", authMiddleware, async (req, res) => {
//   try {
//     const transporterId = req.user.id;
//     const reviews = await CandidateReview.find({ transporterId }).populate(
//       "applicantId"
//     );
//     res.json({ success: true, reviews });
//   } catch (err) {
//     console.error("❌ Greška u GET /candidate-reviews:", err);
//     res.status(500).json({ success: false, message: err.message });
//   }
// });
router.get("/", authMiddleware, async (req, res) => {
  try {
    const transporterId = req.user.id;

    const reviews = await CandidateReview.find({ transporterId })
      .populate("applicantId", "name email profileImage")
      .sort({ createdAt: -1 })
      .lean();

    // Dodaj portfolio svakom kandidatu
    for (const r of reviews) {
      const portfolio = await DriverPortfolio.findOne({
        userId: r.applicantId._id,
      }).select("slug profileImage firstName lastName");
      r.applicantId.portfolio = portfolio || null;
    }

    res.json({ success: true, reviews });
  } catch (err) {
    console.error("❌ Greška u GET /candidate-reviews:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
