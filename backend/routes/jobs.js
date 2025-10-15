import express from "express";
import Job from "../models/Job.js";
import Shop from "../models/Shop.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// Get all jobs
router.get("/", async (req, res) => {
  try {
    const jobs = await Job.find({ isActive: true, status: "active" })
      .populate("createdBy", "name email profileImage")
      .populate("company", "companyName logo")
      .sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ error: "Greška pri učitavanju oglasa" });
  }
});

// Get jobs by user
router.get("/my-jobs", authMiddleware, async (req, res) => {
  try {
    const jobs = await Job.find({ createdBy: req.user._id })
      .populate("company", "companyName logo")
      .sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ error: "Greška pri učitavanju oglasa" });
  }
});

// Get jobs by company
router.get("/company/:companyId", async (req, res) => {
  try {
    const jobs = await Job.find({
      company: req.params.companyId,
      isActive: true,
      status: "active",
    })
      .populate("createdBy", "name email profileImage")
      .sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ error: "Greška pri učitavanju oglasa" });
  }
});

// Get single job
router.get("/:id", async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate("createdBy", "name email profileImage")
      .populate("company", "companyName logo contact socialMedia");
    if (!job) {
      return res.status(404).json({ error: "Oglas nije pronađen" });
    }
    res.json(job);
  } catch (error) {
    res.status(500).json({ error: "Greška pri učitavanju oglasa" });
  }
});

// Create job
router.post("/", authMiddleware, async (req, res) => {
  try {
    const userShop = await Shop.findOne({ userId: req.user.id });

    const jobData = {
      ...req.body,
      createdBy: req.user.id,
      company: userShop ? userShop._id : req.body.company || null,
    };
    // Ako je company prazan string, ukloni ga
    if (jobData.company === "") {
      delete jobData.company;
    }

    console.log("📥 Kreiranje oglasa sa podacima:", jobData);

    const job = new Job(jobData);
    await job.save();

    const populatedJob = await Job.findById(job._id)
      .populate("createdBy", "name email profileImage")
      .populate("company", "companyName logo");

    res.status(201).json(populatedJob);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Greška pri kreiranju oglasa" });
  }
});

// Update job
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ error: "Oglas nije pronađen" });
    }

    // Provera da li je korisnik vlasnik oglasa
    if (job.createdBy.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ error: "Nemate dozvolu za izmenu ovog oglasa" });
    }

    const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate("createdBy", "name email profileImage")
      .populate("company", "companyName logo");

    res.json(updatedJob);
  } catch (error) {
    res.status(400).json({ error: "Greška pri ažuriranju oglasa" });
  }
});

// Delete job
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ error: "Oglas nije pronađen" });
    }

    if (job.createdBy.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ error: "Nemate dozvolu za brisanje ovog oglasa" });
    }

    await Job.findByIdAndDelete(req.params.id);
    res.json({ message: "Oglas uspešno obrisan" });
  } catch (error) {
    res.status(500).json({ error: "Greška pri brisanju oglasa" });
  }
});

export default router;
