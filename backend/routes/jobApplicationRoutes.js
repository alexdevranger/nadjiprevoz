import express from "express";
import JobApplication from "../models/JobApplication.js";
import Job from "../models/Job.js";
import DriverPortfolio from "../models/DriverPortfolio.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

/* 🔹 Kreiraj prijavu */
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { jobId, message, cvUrl } = req.body;
    const applicantId = req.user.id;

    console.log("📝 Kreiranje aplikacije za oglas:", jobId);
    console.log("👤 Applicant ID:", applicantId);

    const job = await Job.findById(jobId);
    if (!job) {
      console.log("❌ Oglas nije pronađen");
      return res.status(404).json({ message: "Oglas nije pronađen" });
    }

    const postoji = await JobApplication.findOne({ jobId, applicantId });
    if (postoji)
      return res
        .status(400)
        .json({ message: "Već ste aplicirali na ovaj oglas" });

    const prijava = await JobApplication.create({
      jobId,
      applicantId,
      transporterId: job.createdBy,
      message,
      cvUrl,
      applicantData: {
        portfolioData: false,
      },
    });
    console.log("✅ Aplikacija uspešno kreirana:", prijava._id);

    res.status(201).json(prijava);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Greška prilikom slanja prijave", error: err.message });
  }
});

/* 🔹 Prikaz prijava korisnika */
router.get("/moje", authMiddleware, async (req, res) => {
  try {
    const prijave = await JobApplication.find({ applicantId: req.user.id })
      .populate("jobId")
      .sort({ createdAt: -1 });
    res.json(prijave);
  } catch (err) {
    res.status(500).json({ message: "Greška prilikom učitavanja prijava" });
  }
});

// Sve prijave na oglase koje je transporter objavio
/* 🔹 Sve prijave na oglase koje je transporter objavio - ISPRAVLJENO */
router.get("/moje-objave", authMiddleware, async (req, res) => {
  try {
    console.log("👤 Učitavanje aplikacija za vlasnika:", req.user.id);

    // Prvo pronađi sve oglase koje je korisnik kreirao
    const mojiOglasi = await Job.find({ createdBy: req.user.id });
    const oglasIds = mojiOglasi.map((oglas) => oglas._id);

    console.log("📋 Moji oglasi IDs:", oglasIds);

    if (oglasIds.length === 0) {
      console.log("ℹ️ Korisnik nema oglasa");
      return res.json([]);
    }

    // Sada pronađi sve aplikacije za te oglase
    const prijave = await JobApplication.find({
      jobId: { $in: oglasIds },
    })
      .populate("applicantId", "name email phone")
      .populate("jobId", "title position")
      .sort({ createdAt: -1 });

    console.log("📨 Pronađene aplikacije:", prijave.length);

    res.json(prijave);
  } catch (err) {
    console.error("Greška pri učitavanju prijava:", err);
    res.status(500).json({ message: "Greška prilikom učitavanja prijava" });
  }
});

/* 🔹 Transporter vidi prijave za svoj oglas */
router.get("/oglas/:jobId", authMiddleware, async (req, res) => {
  try {
    const { jobId } = req.params;

    console.log("🔍 Tražim aplikacije za oglas:", jobId);
    console.log("👤 Trenutni korisnik ID:", req.user.id);

    // Prvo proveri da li oglas postoji i da li je korisnik vlasnik
    const job = await Job.findById(jobId);
    if (!job) {
      console.log("❌ Oglas nije pronađen");
      return res.status(404).json({ message: "Oglas nije pronađen" });
    }

    console.log("🏢 Vlasnik oglasa (createdBy):", job.createdBy.toString());

    // Proveri da li je korisnik vlasnik oglasa
    if (job.createdBy.toString() !== req.user.id) {
      console.log("🚫 Korisnik nije vlasnik oglasa");
      return res.status(403).json({ message: "Niste vlasnik ovog oglasa" });
    }

    // Sada traži sve aplikacije za ovaj oglas (bez provere transporterId)
    const prijave = await JobApplication.find({
      jobId: jobId,
    })
      .populate("applicantId", "name email phone")
      .sort({ createdAt: -1 });

    console.log("📨 Pronađene aplikacije:", prijave.length);

    res.json(prijave);
  } catch (err) {
    console.error("Greška pri učitavanju prijava:", err);
    res.status(500).json({ message: "Greška prilikom učitavanja prijava" });
  }
});

/* 🔹 Ažuriranje statusa prijave */
router.patch("/:id/status", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updated = await JobApplication.findOneAndUpdate(
      { _id: id, transporterId: req.user.id },
      { status },
      { new: true }
    );

    if (!updated)
      return res.status(404).json({ message: "Prijava nije pronađena" });
    res.json(updated);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Greška prilikom ažuriranja statusa prijave" });
  }
});

// U jobApplicationRoutes.js dodaj ovu rutu:

/* 🔹 Kreiraj prijavu sa podacima iz portfolija */
// router.post("/apply-with-portfolio", authMiddleware, async (req, res) => {
//   try {
//     const { jobId, message } = req.body;
//     const applicantId = req.user.id;

//     const job = await Job.findById(jobId);
//     if (!job) return res.status(404).json({ message: "Oglas nije pronađen" });

//     const postoji = await JobApplication.findOne({ jobId, applicantId });
//     if (postoji) {
//       return res
//         .status(400)
//         .json({ message: "Već ste aplicirali na ovaj oglas" });
//     }

//     // Dohvati podatke iz portfolija
//     const portfolio = await DriverPortfolio.findOne({
//       userId: applicantId,
//     }).populate("userId", "name email phone");

//     let applicantData = null;

//     if (portfolio) {
//       applicantData = {
//         name: portfolio.userId.name,
//         email: portfolio.userId.email,
//         phone: portfolio.userId.phone,
//         yearsOfExperience: portfolio.yearsOfExperience,
//         hasOwnVehicle: portfolio.hasOwnVehicle,
//         vehicleType: portfolio.vehicleType,
//         previousExperience: portfolio.previousExperience.map((exp) => ({
//           companyName: exp.companyName,
//           position: exp.position,
//           duration: `${
//             exp.startDate ? new Date(exp.startDate).getFullYear() : ""
//           } - ${
//             exp.current
//               ? "sada"
//               : exp.endDate
//               ? new Date(exp.endDate).getFullYear()
//               : ""
//           }`,
//         })),
//         skills: portfolio.skills,
//         portfolioData: true,
//       };
//     }

//     const prijava = await JobApplication.create({
//       jobId,
//       applicantId,
//       transporterId: job.createdBy,
//       message,
//       applicantData,
//     });

//     res.status(201).json({
//       success: true,
//       message: "Prijava uspešno poslata",
//       prijava,
//     });
//   } catch (err) {
//     res.status(500).json({
//       message: "Greška prilikom slanja prijave",
//       error: err.message,
//     });
//   }
// });
/* 🔹 Kreiraj prijavu sa podacima iz portfolija */
router.post("/apply-with-portfolio", authMiddleware, async (req, res) => {
  try {
    const { jobId, message } = req.body;
    const applicantId = req.user.id;

    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: "Oglas nije pronađen" });

    const postoji = await JobApplication.findOne({ jobId, applicantId });
    if (postoji) {
      return res
        .status(400)
        .json({ message: "Već ste aplicirali na ovaj oglas" });
    }

    // 🔹 Učitaj portfolio kandidata
    const portfolio = await DriverPortfolio.findOne({ userId: applicantId })
      .populate("userId", "name email phone")
      .populate("vehicles"); // ako imaš ref na Vehicle modele

    let applicantData = null;

    if (portfolio) {
      applicantData = {
        firstName: portfolio.firstName,
        lastName: portfolio.lastName,
        email: portfolio.contactInfo.email,
        phone: portfolio.contactInfo.phone,
        yearsOfExperience: portfolio.yearsOfExperience,
        hasOwnVehicle: portfolio.vehicles && portfolio.vehicles.length > 0,
        vehicles:
          portfolio.vehicles?.map((v) => ({
            type: v.type,
            capacity: v.capacity,
            licensePlate: v.licensePlate,
            year: v.year,
            description: v.description,
            pallets: v.pallets,
            dimensions: v.dimensions,
            image1: v.image1,
            image2: v.image2,
          })) || [],
        expectedSalary: portfolio.salaryExpectation || null,
        availability: portfolio.availability || null,
        driverLicenses: portfolio.licenseCategories || [], // kategorije vozačke dozvole
        previousExperience:
          portfolio.previousExperience?.map((exp) => ({
            companyName: exp.companyName,
            position: exp.position,
            duration: `${
              exp.startDate ? new Date(exp.startDate).getFullYear() : ""
            } - ${
              exp.current
                ? "sada"
                : exp.endDate
                ? new Date(exp.endDate).getFullYear()
                : ""
            }`,
          })) || [],
        skills: portfolio.skills || [],
        portfolioData: true,
      };
    }

    const prijava = await JobApplication.create({
      jobId,
      applicantId,
      transporterId: job.createdBy,
      message,
      applicantData,
    });

    res.status(201).json({
      success: true,
      message: "Prijava uspešno poslata",
      prijava,
    });
  } catch (err) {
    console.error("❌ Greška u /apply-with-portfolio:", err);
    res.status(500).json({
      message: "Greška prilikom slanja prijave",
      error: err.message,
    });
  }
});
router.patch("/change/:id/status", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const updated = await JobApplication.findOneAndUpdate(
    { _id: id, transporterId: req.user.id }, // <— ovo obezbeđuje da samo vlasnik može menjati
    { status },
    { new: true }
  );
  if (!updated)
    return res.status(404).json({ message: "Prijava nije pronađena" });
  res.json(updated);
});
export default router;
