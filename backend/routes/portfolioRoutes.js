import express from "express";
import DriverPortfolio from "../models/DriverPortfolio.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import mongoose from "mongoose";

const router = express.Router();

// 🔹 Dohvati portfolio korisnika - BEZ 404 GREŠKE
router.get("/my-portfolio", authMiddleware, async (req, res) => {
  try {
    console.log("req.user.id:", req.user.id);
    const portfolio = await DriverPortfolio.findOne({
      userId: req.user.id,
    })
      //   .populate(
      //     "vehicles",
      //     "brand model year capacity licensePlate type image1 dimensions description"
      //   ) // DODAJTE OVO
      .populate("userId", "name email phone profileImage");

    console.log("Fetched portfolio:", portfolio);

    // Uvek vraćaj success, čak i ako portfolio ne postoji
    res.json({
      success: true,
      portfolio: portfolio || null,
      message: portfolio ? "Portfolio pronađen" : "Korisnik nema portfolio",
    });
  } catch (err) {
    console.error("Greška u /my-portfolio:", err);
    res.status(500).json({
      success: false,
      message: "Greška prilikom učitavanja portfolija",
      error: err.message,
    });
  }
});

// 🔹 Provera dostupnosti sluga
router.get("/check-slug/:slug", async (req, res) => {
  try {
    const { slug } = req.params;
    const existingPortfolio = await DriverPortfolio.findOne({ slug });

    res.json({ available: !existingPortfolio });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Greška pri proveri sluga",
      error: err.message,
    });
  }
});

// 🔹 Javni pristup portfolio-u preko sluga
router.get("/public/:slug", async (req, res) => {
  try {
    const { slug } = req.params;

    const portfolio = await DriverPortfolio.findOne({
      slug,
      isActive: true,
    }).populate("vehicles");

    if (!portfolio) {
      return res.status(404).json({
        success: false,
        message: "Portfolio nije pronađen",
      });
    }

    res.json({
      success: true,
      portfolio,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Greška prilikom učitavanja portfolija",
      error: err.message,
    });
  }
});

router.patch("/public/:slug/view", async (req, res) => {
  try {
    const { slug } = req.params;

    const portfolio = await DriverPortfolio.findOne({
      slug,
      isActive: true,
    });

    if (!portfolio) {
      return res.status(404).json({
        success: false,
        message: "Portfolio nije pronađen",
      });
    }

    // Povećaj viewCount
    portfolio.viewCount += 1;
    await portfolio.save();

    res.json({
      success: true,
      message: "ViewCount uspešno ažuriran",
      viewCount: portfolio.viewCount,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Greška prilikom ažuriranja viewCount-a",
      error: err.message,
    });
  }
});

// 🔹 Dohvati vozila korisnika za portfolio
router.get("/my-vehicles", authMiddleware, async (req, res) => {
  try {
    const Vehicle = mongoose.model("Vehicle");
    const vehicles = await Vehicle.find({
      userId: req.user.id,
    }).select(
      "brand model year capacity licensePlate type image1 dimensions description"
    );

    res.json({
      success: true,
      vehicles,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Greška pri učitavanju vozila",
      error: err.message,
    });
  }
});

// 🔹 Kreiraj ili ažuriraj portfolio
router.post("/", authMiddleware, async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      yearsOfExperience,
      licenseCategories,
      previousExperience,
      skills,
      languages,
      availability,
      preferredJobTypes,
      salaryExpectation,
      aboutMe,
      contactInfo,
      slug,
      vehicles,
    } = req.body;

    const userId = req.user.id;

    // VALIDACIJA: Ukloni duplikate iz vehicles niza
    const uniqueVehicles = vehicles ? [...new Set(vehicles)] : [];

    // Generiši slug ako nije prosleđen
    let portfolioSlug = slug;
    if (!portfolioSlug) {
      const fullName = `${firstName} ${lastName}`.trim();
      portfolioSlug = fullName
        .toLowerCase()
        .replace(/[^a-z0-9 -]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim();

      // Proveri jedinstvenost i dodaj broj ako je potrebno
      let uniqueSlug = portfolioSlug;
      let counter = 1;
      while (
        await DriverPortfolio.findOne({
          slug: uniqueSlug,
          userId: { $ne: userId },
        })
      ) {
        uniqueSlug = `${portfolioSlug}-${counter}`;
        counter++;
      }
      portfolioSlug = uniqueSlug;
    }

    // Proveri da li portfolio već postoji
    let portfolio = await DriverPortfolio.findOne({ userId });

    const portfolioData = {
      firstName: firstName || "",
      lastName: lastName || "",
      yearsOfExperience: yearsOfExperience || 0,
      licenseCategories: Array.isArray(licenseCategories)
        ? licenseCategories
        : [],
      previousExperience: Array.isArray(previousExperience)
        ? previousExperience
        : [],
      skills: Array.isArray(skills) ? skills : [],
      languages: Array.isArray(languages) ? languages : [],
      availability: availability || "dostupan",
      preferredJobTypes: Array.isArray(preferredJobTypes)
        ? preferredJobTypes
        : [],
      salaryExpectation: salaryExpectation || "",
      aboutMe: aboutMe || "",
      contactInfo: contactInfo || {},
      vehicles: uniqueVehicles,
      slug: portfolioSlug,
    };

    console.log("Podaci za čuvanje:", portfolioData);

    if (portfolio) {
      // Ažuriraj postojeći portfolio
      portfolio = await DriverPortfolio.findOneAndUpdate(
        { userId },
        portfolioData,
        { new: true, runValidators: true }
      ).populate("vehicles");
    } else {
      // Kreiraj novi portfolio
      portfolio = await DriverPortfolio.create({
        userId,
        ...portfolioData,
      });

      await portfolio.populate("vehicles");
    }

    res.status(200).json({
      success: true,
      message: "Portfolio uspešno sačuvan",
      portfolio,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Greška prilikom čuvanja portfolija",
      error: err.message,
    });
  }
});

// 🔹 Dohvati portfolio po ID-u (za javni pristup) - ISPRAVLJENO
router.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const portfolio = await DriverPortfolio.findOne({
      userId,
      isActive: true,
    }).populate("vehicles");

    if (!portfolio) {
      return res.status(404).json({
        success: false,
        message: "Portfolio nije pronađen",
      });
    }

    res.json({
      success: true,
      portfolio,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Greška prilikom učitavanja portfolija",
      error: err.message,
    });
  }
});

// 🔹 Ažuriraj status portfolija (plaćeni/besplatni) - ISPRAVLJENO
router.patch("/premium", authMiddleware, async (req, res) => {
  try {
    const { hasPaidPortfolio } = req.body;

    const portfolio = await DriverPortfolio.findOneAndUpdate(
      { userId: req.user.id },
      { hasPaidPortfolio },
      { new: true }
    ).populate("vehicles");

    if (!portfolio) {
      return res.status(404).json({
        success: false,
        message: "Portfolio nije pronađen",
      });
    }

    res.json({
      success: true,
      message: hasPaidPortfolio
        ? "Portfolio je ažuriran na premium"
        : "Portfolio je ažuriran na osnovni",
      portfolio,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Greška prilikom ažuriranja portfolija",
      error: err.message,
    });
  }
});

// 🔹 Obriši portfolio - ISPRAVLJENO
router.delete("/", authMiddleware, async (req, res) => {
  try {
    const result = await DriverPortfolio.findOneAndDelete({
      userId: req.user.id,
    });

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Portfolio nije pronađen",
      });
    }

    res.json({
      success: true,
      message: "Portfolio uspešno obrisan",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Greška prilikom brisanja portfolija",
      error: err.message,
    });
  }
});

export default router;
