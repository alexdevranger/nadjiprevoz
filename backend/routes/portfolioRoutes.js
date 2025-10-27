import express from "express";
import DriverPortfolio from "../models/DriverPortfolio.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// 🔹 Dohvati portfolio korisnika - BEZ 404 GREŠKE
router.get("/my-portfolio", authMiddleware, async (req, res) => {
  try {
    console.log("req.user.id:", req.user.id);
    const portfolio = await DriverPortfolio.findOne({
      userId: req.user.id,
    })
      .populate("userId", "name email phone profileImage")
      .populate("vehicles");

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
    })
      .populate("userId", "name email phone profileImage")
      .populate("vehicles");

    if (!portfolio) {
      return res.status(404).json({
        success: false,
        message: "Portfolio nije pronađen",
      });
    }

    // Povećaj broj pregleda
    portfolio.viewCount += 1;
    await portfolio.save();

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

    // Generiši slug ako nije prosleđen
    let portfolioSlug = slug;
    if (!portfolioSlug) {
      const user = await mongoose.model("User").findById(userId);
      portfolioSlug = user.name
        .toLowerCase()
        .replace(/[^a-z0-9 -]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim();

      // Proveri jedinstvenost i dodaj broj ako je potrebno
      let uniqueSlug = portfolioSlug;
      let counter = 1;
      while (await DriverPortfolio.findOne({ slug: uniqueSlug })) {
        uniqueSlug = `${portfolioSlug}-${counter}`;
        counter++;
      }
      portfolioSlug = uniqueSlug;
    }

    // Proveri da li portfolio već postoji
    let portfolio = await DriverPortfolio.findOne({ userId });

    if (portfolio) {
      // Ažuriraj postojeći portfolio
      portfolio = await DriverPortfolio.findOneAndUpdate(
        { userId },
        {
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
          vehicles,
          slug: portfolioSlug,
        },
        { new: true }
      )
        .populate("userId", "name email phone profileImage")
        .populate("vehicles");
    } else {
      // Kreiraj novi portfolio
      portfolio = await DriverPortfolio.create({
        userId,
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
        vehicles,
        slug: portfolioSlug,
      });

      await portfolio.populate("userId", "name email phone profileImage");
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

// 🔹 Dohvati portfolio po ID-u (za javni pristup)
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const portfolio = await DriverPortfolio.findOne({ userId }).populate(
      "userId",
      "name email phone profileImage company"
    );

    if (!portfolio || !portfolio.isActive) {
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

// 🔹 Ažuriraj status portfolija (plaćeni/besplatni)
router.patch("/premium", authMiddleware, async (req, res) => {
  try {
    const { hasPaidPortfolio } = req.body;

    const portfolio = await DriverPortfolio.findOneAndUpdate(
      { userId: req.user.id },
      { hasPaidPortfolio },
      { new: true }
    );

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

// 🔹 Obriši portfolio
router.delete("/", authMiddleware, async (req, res) => {
  try {
    await DriverPortfolio.findOneAndDelete({ userId: req.user.id });

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
