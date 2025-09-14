import express from "express";
import Payment from "../models/Payment.js";
import Tour from "../models/Tour.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { adminAuthMiddleware } from "../middleware/adminAuthMiddleware.js";

const router = express.Router();

// POST /api/payments/initiate
router.post("/initiate", authMiddleware, async (req, res) => {
  try {
    const { tourId } = req.body;
    const userId = req.user.id; // iz auth middleware-a

    // Generišemo jedinstveni poziv na broj
    const referenceNumber = `PREM-${tourId}-${Math.floor(
      Math.random() * 10000
    )}`;

    const payment = new Payment({
      user: userId,
      tour: tourId,
      amount: 2000, // definisana cena premijuma
      referenceNumber,
    });

    await payment.save();

    res.json({
      message: "Uputstvo za uplatu generisano",
      accountNumber: "160-123456789-12", // tvoj broj računa
      amount: payment.amount,
      referenceNumber: payment.referenceNumber,
      tourId,
    });
  } catch (err) {
    console.error("Greška pri generisanju uplate:", err);
    res.status(500).json({ error: "Greška pri generisanju uplate" });
  }
});

// 📌 GET /api/payments (admin gleda sve uplate)
router.get("/", adminAuthMiddleware, async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate("user", "name email") // ime i email korisnika
      .populate(
        "tour",
        "startLocation endLocation date isPremium premiumExpiresAt"
      ) // detalji ture
      .sort({ createdAt: -1 });

    res.json(payments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Greška pri učitavanju uplata" });
  }
});

// ✅ Admin potvrđuje uplatu
router.put("/:id/confirm", adminAuthMiddleware, async (req, res) => {
  try {
    // Nađi uplatu i populate tour i user
    const payment = await Payment.findById(req.params.id)
      .populate("tour")
      .populate("user");

    if (!payment) {
      return res.status(404).json({ message: "Uplata nije pronađena" });
    }

    if (payment.status === "paid") {
      return res.status(400).json({ message: "Uplata je već potvrđena" });
    }

    console.log("payment", payment);

    // ✅ Update status uplate
    payment.status = "paid";
    payment.updatedAt = new Date();
    const pay = await payment.save();
    console.log("pay", pay);

    // ✅ Ako uplata ima vezanu turu/oglas, postavi kao premium
    let premiumExpiresAt = null;
    if (payment.tour) {
      const adTour = await Tour.findById(payment.tour);
      if (adTour) {
        console.log("ad tour", adTour);
        adTour.isPremium = true;
        premiumExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 dana
        adTour.premiumExpiresAt = premiumExpiresAt;
        const savedAd = await adTour.save();
        console.log("savedAd", savedAd);
      }
    }

    // Pošalji response sa porukom i premium datumom
    res.json({
      message: "Uplata potvrđena",
      payment: {
        ...payment.toObject(),
        tour: payment.tour
          ? { ...payment.tour.toObject(), premiumExpiresAt }
          : null,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Greška na serveru" });
  }
});

// Promote oglas/turu na premium
router.post("/admin/:id/promote", adminAuthMiddleware, async (req, res) => {
  try {
    const ad = await Ad.findById(req.params.id);
    if (!ad) return res.status(404).json({ message: "Oglas nije pronađen" });

    ad.isPremium = true;
    ad.premiumExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 dana
    await ad.save();

    res.json({
      message: "Oglas postavljen kao premium",
      ad,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Greška na serveru" });
  }
});

// // ✅ Admin potvrđuje uplatu
// router.put("/:id/confirm", adminAuthMiddleware, async (req, res) => {
//   try {
//     const payment = await Payment.findById(req.params.id).populate("tour")
//       .populate("user");
//     if (!payment) {
//       return res.status(404).json({ message: "Uplata nije pronađena" });
//     }

//     if (payment.status === "paid") {
//       return res.status(400).json({ message: "Uplata je već potvrđena" });
//     }

//     // ✅ Update status
//     payment.status = "paid";
//     payment.updatedAt = new Date();
//     await payment.save();

//     // nadji oglas
//     const ad = await Ad.findById(payment.tour);
//     if (ad) {
//       ad.isPremium = true;
//       ad.premiumExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
//       await ad.save();
//     }

//     // ✅ Ako se odnosi na oglas/turu, postavi ga kao premium
//     if (payment.tour) {
//       await Ad.findByIdAndUpdate(payment.tour, { isPremium: true });
//     }

//     res.json({ message: "Uplata potvrđena", payment });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Greška na serveru" });
//   }
// });

export default router;
