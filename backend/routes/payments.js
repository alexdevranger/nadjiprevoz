import express from "express";
import Payment from "../models/Payment.js";
import ShipmentPayment from "../models/ShipmentPayment.js";
import Tour from "../models/Tour.js";
import Shipment from "../models/Shipment.js";
import Ad from "../models/Ad.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { adminAuthMiddleware } from "../middleware/adminAuthMiddleware.js";

const router = express.Router();

// Helper funkcija za emitovanje događaja
const emitPaymentEvent = (eventName, data) => {
  // Koristimo globalni io objekat
  if (typeof global.io !== "undefined") {
    global.io.emit(eventName, data);
    console.log(`Emitovan event: ${eventName}`, data);
  } else {
    console.log("IO nije dostupan za emitovanje eventa:", eventName);
  }
};

// POST /api/payments/initiate
router.post("/initiateTourPremium", authMiddleware, async (req, res) => {
  try {
    const { tourId } = req.body;
    const userId = req.user.id; // iz auth middleware-a

    // Proveri da li turu već ima pending premium zahtev
    const existingPayment = await Payment.findOne({
      tour: tourId,
      user: userId,
      status: "pending",
    });

    if (existingPayment) {
      return res.status(400).json({
        error: "Već postoji zahtev za premium koji čeka odobrenje",
      });
    }

    // Ažuriraj status ture
    await Tour.findByIdAndUpdate(tourId, {
      premiumStatus: "pending",
    });

    // Generišemo jedinstveni poziv na broj
    const randomNum = Math.floor(1000 + Math.random() * 9000); // 4-cifreni broj
    const referenceNumber = `00${randomNum}PREM${tourId}`.slice(0, 20);

    const payment = new Payment({
      user: userId,
      tour: tourId,
      amount: 2000, // definisana cena premijuma
      referenceNumber,
      status: "pending",
    });

    await payment.save();

    // Populate za slanje podataka
    await payment.populate("user", "name email");
    await payment.populate("tour", "startLocation endLocation date");

    // EMITUJ DOGADJAJ ZA NOVI PAYMENT
    emitPaymentEvent("newPaymentRequest", {
      type: "tour",
      payment: payment,
    });

    res.json({
      message: "Uputstvo za uplatu generisano",
      accountNumber: "265110031008170359", // tvoj broj računa
      amount: payment.amount,
      referenceNumber: payment.referenceNumber,
      tourId,
    });
  } catch (err) {
    console.error("Greška pri generisanju uplate:", err);
    res.status(500).json({ error: "Greška pri generisanju uplate" });
  }
});
router.post("/initiateShipmentPremium", authMiddleware, async (req, res) => {
  try {
    const { shipmentId } = req.body;
    const userId = req.user.id; // iz auth middleware-a

    // Proveri da li shipment već ima pending premium zahtev
    const existingPayment = await ShipmentPayment.findOne({
      shipment: shipmentId,
      user: userId,
      status: "pending",
    });

    if (existingPayment) {
      return res.status(400).json({
        error: "Već postoji zahtev za premium koji čeka odobrenje",
      });
    }

    // Ažuriraj status shipmenta
    await Shipment.findByIdAndUpdate(shipmentId, {
      premiumStatus: "pending",
    });

    // Generišemo jedinstveni poziv na broj
    const referenceNumber = `PREM-${shipmentId}-${Math.floor(
      Math.random() * 10000
    )}`;

    const payment = new ShipmentPayment({
      user: userId,
      shipment: shipmentId,
      amount: 2000, // definisana cena premijuma
      referenceNumber,
      status: "pending",
    });

    await payment.save();

    // Populate za slanje podataka
    await payment.populate("user", "name email");
    await payment.populate("shipment", "pickupLocation dropoffLocation date");

    // EMITUJ DOGADJAJ ZA NOVI PAYMENT
    emitPaymentEvent("newPaymentRequest", {
      type: "shipment",
      payment: payment,
    });

    res.json({
      message: "Uputstvo za uplatu generisano",
      accountNumber: "160-123456789-12", // tvoj broj računa
      amount: payment.amount,
      referenceNumber: payment.referenceNumber,
      shipmentId,
    });
  } catch (err) {
    console.error("Greška pri generisanju uplate:", err);
    res.status(500).json({ error: "Greška pri generisanju uplate" });
  }
});

// GET /api/payments/my-pending-payments (provera pending paymenta za korisnika)
router.get("/my-pending-payments", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    const tourPayments = await Payment.find({
      user: userId,
      status: "pending",
    }).populate("tour", "_id");

    const shipmentPayments = await ShipmentPayment.find({
      user: userId,
      status: "pending",
    }).populate("shipment", "_id");

    res.json({
      tourPayments,
      shipmentPayments,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Greška pri učitavanju uplata" });
  }
});

// 📌 GET /api/payments (admin gleda sve uplate)
router.get("/", adminAuthMiddleware, async (req, res) => {
  try {
    const tourPayments = await Payment.find()
      .populate("user", "name email") // ime i email korisnika
      .populate(
        "tour",
        "startLocation endLocation date isPremium premiumExpiresAt"
      ) // detalji ture
      .sort({ createdAt: -1 });
    const shipmentPayments = await ShipmentPayment.find()
      .populate("user", "name email") // ime i email korisnika
      .populate(
        "shipment",
        "pickupLocation dropoffLocation date weightKg goodsType isPremium premiumExpiresAt "
      ) // detalji ture
      .sort({ createdAt: -1 });

    res.json({ tourPayments, shipmentPayments });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Greška pri učitavanju uplata" });
  }
});

// ✅ Admin potvrđuje uplatu
router.put("/:id/confirmTourPayment", adminAuthMiddleware, async (req, res) => {
  try {
    const { status, adminNotes } = req.body;
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

    // Ažuriraj payment
    payment.status = status || "paid"; // može da se prosledi status, inače je "paid"
    if (adminNotes) payment.adminNotes = adminNotes;
    payment.paymentDate = new Date();
    payment.premiumExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 dana

    const pay = await payment.save();
    console.log("pay", pay);

    // ✅ Ako uplata ima vezanu turu, ažuriraj tour status
    let updatedTour = null;
    if (payment.tour) {
      console.log("payment.tour", payment.tour);
      const tour = await Tour.findById(payment.tour._id || payment.tour);
      if (tour) {
        console.log("tour pre ažuriranja", tour);

        if (status === "paid" || !status) {
          // Ako je uplata potvrđena
          tour.isPremium = true;
          tour.premiumStatus = "approved";
          tour.premiumExpiresAt = payment.premiumExpiresAt;
        } else if (status === "rejected") {
          // Ako je uplata odbijena
          tour.premiumStatus = "rejected";
          tour.isPremium = false;
          tour.premiumExpiresAt = null;
        }

        updatedTour = await tour.save();
        console.log("tour posle ažuriranja", updatedTour);
      }
    }

    // EMITUJ DOGADJAJ ZA AŽURIRANJE PAYMENTA
    emitPaymentEvent("paymentUpdated", {
      paymentId: payment._id,
      type: "tour",
      status: payment.status,
      adminNotes: payment.adminNotes,
    });

    // EMITUJ DOGADJAJ SPECIFIČNOM KORISNIKU
    if (payment.user && payment.user._id) {
      emitPaymentEvent("myPaymentUpdated", {
        paymentId: payment._id,
        type: "tour",
        status: payment.status,
        adminNotes: payment.adminNotes,
        tourId: payment.tour?._id || payment.tour,
        userId: payment.user._id,
      });
    }

    // Pošalji response sa porukom i premium datumom
    res.json({
      message: status === "rejected" ? "Uplata odbijena" : "Uplata potvrđena",
      payment: pay,
      tour: updatedTour,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Greška na serveru" });
  }
});

router.put(
  "/:id/confirmShipmentPayment",
  adminAuthMiddleware,
  async (req, res) => {
    try {
      const { status, adminNotes } = req.body;
      // Nađi uplatu i populate tour i user
      const payment = await ShipmentPayment.findById(req.params.id)
        .populate("shipment")
        .populate("user");

      if (!payment) {
        return res.status(404).json({ message: "Uplata nije pronađena" });
      }

      if (payment.status === "paid") {
        return res.status(400).json({ message: "Uplata je već potvrđena" });
      }

      console.log("payment", payment);

      // ✅ Update status uplate
      payment.status = status || "paid";
      if (adminNotes) payment.adminNotes = adminNotes;
      payment.paymentDate = new Date();
      payment.premiumExpiresAt = new Date(
        Date.now() + 30 * 24 * 60 * 60 * 1000
      ); // 30 dana

      const pay = await payment.save();
      console.log("pay", pay);

      // ✅ Ako uplata ima vezanu turu/oglas, postavi kao premium

      let updatedShipment = null;
      if (payment.shipment) {
        console.log("payment.shipment", payment.shipment);
        const shipment = await Shipment.findById(
          payment.shipment._id || payment.shipment
        );
        if (shipment) {
          console.log("shipment pre ažuriranja", shipment);

          if (status === "paid" || !status) {
            shipment.isPremium = true;
            shipment.premiumStatus = "approved";
            shipment.premiumExpiresAt = payment.premiumExpiresAt;
          } else if (status === "rejected") {
            shipment.premiumStatus = "rejected";
            shipment.isPremium = false;
            shipment.premiumExpiresAt = null;
          }

          updatedShipment = await shipment.save();
          console.log("shipment posle ažuriranja", updatedShipment);
        }
      }

      // EMITUJ DOGADJAJ ZA AŽURIRANJE PAYMENTA
      emitPaymentEvent("paymentUpdated", {
        paymentId: payment._id,
        type: "shipment",
        status: payment.status,
        adminNotes: payment.adminNotes,
      });

      // EMITUJ DOGADJAJ SPECIFIČNOM KORISNIKU
      if (payment.user && payment.user._id) {
        emitPaymentEvent("myPaymentUpdated", {
          paymentId: payment._id,
          type: "shipment",
          status: payment.status,
          adminNotes: payment.adminNotes,
          shipmentId: payment.shipment?._id || payment.shipment,
          userId: payment.user._id,
        });
      }

      // Pošalji response sa porukom i premium datumom
      res.json({
        message: status === "rejected" ? "Uplata odbijena" : "Uplata potvrđena",
        payment: pay,
        shipment: updatedShipment,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Greška na serveru" });
    }
  }
);

// ✅ RESETUJ Tour premium status i Payment status na "none"
// router.put("/:id/resetTourPremium", adminAuthMiddleware, async (req, res) => {
//   try {
//     const payment = await Payment.findById(req.params.id).populate("tour");

//     if (!payment) {
//       return res.status(404).json({ message: "Uplata nije pronađena" });
//     }

//     if (!payment.tour) {
//       return res
//         .status(400)
//         .json({ message: "Nema povezane ture sa ovom uplatom" });
//     }

//     // Resetuj Payment
//     payment.status = "none";
//     await payment.save();

//     // Resetuj Tour
//     const tour = await Tour.findById(payment.tour._id);
//     if (tour) {
//       tour.isPremium = false;
//       tour.premiumStatus = "none";
//       payment.paymentDate = null;
//       tour.premiumExpiresAt = null;
//       await tour.save();
//     }

//     // Emituj event za osveženje
//     emitPaymentEvent("paymentUpdated", {
//       paymentId: payment._id,
//       type: "tour",
//       status: "none",
//     });

//     res.json({
//       message: "Tour premium status i uplata vraćeni na 'none'.",
//       payment,
//       tour,
//     });
//   } catch (err) {
//     console.error("Greška pri resetovanju:", err);
//     res.status(500).json({ message: "Greška na serveru" });
//   }
// });
router.put("/:id/resetTourPremium", adminAuthMiddleware, async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate("tour")
      .populate("user");

    if (!payment) {
      return res.status(404).json({ message: "Uplata nije pronađena" });
    }

    if (!payment.tour) {
      return res
        .status(400)
        .json({ message: "Nema povezane ture sa ovom uplatom" });
    }

    // Resetuj Payment
    payment.status = "none";
    payment.adminNotes = ""; // opcionalno - brišemo admin napomene ako želiš čist reset
    payment.paymentDate = null;
    payment.premiumExpiresAt = null;
    await payment.save();

    // Resetuj Tour
    const tour = await Tour.findById(payment.tour._id);
    let updatedTour = null;
    if (tour) {
      tour.isPremium = false;
      tour.premiumStatus = "none";
      tour.premiumExpiresAt = null;
      updatedTour = await tour.save();
    }

    // ✅ Emituj event za ADMIN dashboard
    emitPaymentEvent("paymentUpdated", {
      paymentId: payment._id,
      type: "tour",
      status: "none",
      adminNotes: "",
    });

    // ✅ Emituj event SPECIFIČNOM KORISNIKU
    if (payment.user && payment.user._id) {
      emitPaymentEvent("myPaymentUpdated", {
        paymentId: payment._id,
        type: "tour",
        status: "none",
        adminNotes: "",
        tourId: payment.tour?._id || payment.tour,
        userId: payment.user._id,
      });
    }

    res.json({
      message: "Tour premium status i uplata vraćeni na 'none'.",
      payment,
      tour: updatedTour,
    });
  } catch (err) {
    console.error("Greška pri resetovanju:", err);
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

export default router;
