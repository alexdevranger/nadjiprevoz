import express from "express";
import CompanyReview from "../models/CompanyReview.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// 🔹 Dohvati sve ocene koje je kandidat dao firmama
router.get("/my", authMiddleware, async (req, res) => {
  try {
    const reviews = await CompanyReview.find({ applicantId: req.user.id })
      .populate("companyId", "companyName logo slug")
      .sort({ createdAt: -1 });

    res.json({ success: true, reviews });
  } catch (err) {
    console.error("❌ Greška u GET /company-reviews/my:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// 🔹 Dodaj ili ažuriraj ocenu firme
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { companyId, rating, comment } = req.body;
    const applicantId = req.user.id;

    if (!companyId || !rating)
      return res
        .status(400)
        .json({ success: false, message: "Nedostaju podaci." });

    // ako već postoji ocena → ažuriraj
    let review = await CompanyReview.findOne({ applicantId, companyId });

    if (review) {
      review.rating = rating;
      review.comment = comment;
      await review.save();
      // 🔹 ponovo učitaj sa .populate() da se vrate podaci firme
      review = await CompanyReview.findById(review._id).populate(
        "companyId",
        "companyName logo slug"
      );
      return res.json({
        success: true,
        review,
        message: "Ocena ažurirana.",
      });
    }

    review = await CompanyReview.create({
      applicantId,
      companyId,
      rating,
      comment,
    });

    // 🔹 i ovde popuni podatke o firmi
    review = await CompanyReview.findById(review._id).populate(
      "companyId",
      "companyName logo slug"
    );

    res.status(201).json({ success: true, review, message: "Ocena sačuvana." });
  } catch (err) {
    console.error("❌ Greška u POST /company-reviews:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});
//     const existing = await CompanyReview.findOne({ applicantId, companyId });

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

//     const review = await CompanyReview.create({
//       applicantId,
//       companyId,
//       rating,
//       comment,
//     });
//     res.status(201).json({ success: true, review, message: "Ocena sačuvana." });
//   } catch (err) {
//     console.error("❌ Greška u POST /company-reviews:", err);
//     res.status(500).json({ success: false, message: err.message });
//   }
// });

// 🔹 Vrati moju ocenu za firmu
router.get("/:companyId", authMiddleware, async (req, res) => {
  try {
    const review = await CompanyReview.findOne({
      applicantId: req.user.id,
      companyId: req.params.companyId,
    });
    res.json({ success: true, review });
  } catch (err) {
    console.error("❌ Greška u GET /company-reviews/:companyId:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
