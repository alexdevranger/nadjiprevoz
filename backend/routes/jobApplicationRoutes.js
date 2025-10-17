import express from "express";
import JobApplication from "../models/JobApplication.js";
import Job from "../models/Job.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

/* 🔹 Kreiraj prijavu */
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { jobId, message, cvUrl } = req.body;
    const applicantId = req.user.id;

    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: "Oglas nije pronađen" });

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
    });

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
router.get("/moje-objave", authMiddleware, async (req, res) => {
  try {
    const prijave = await JobApplication.find({ transporterId: req.user.id })
      .populate("applicantId", "name email phone")
      .populate("jobId", "title")
      .sort({ createdAt: -1 });
    res.json(prijave);
  } catch (err) {
    res.status(500).json({ message: "Greška prilikom učitavanja prijava" });
  }
});

/* 🔹 Transporter vidi prijave za svoj oglas */
router.get("/oglas/:jobId", authMiddleware, async (req, res) => {
  try {
    const { jobId } = req.params;
    const prijave = await JobApplication.find({
      jobId,
      transporterId: req.user.id,
    })
      .populate("applicantId", "name email phone")
      .sort({ createdAt: -1 });

    res.json(prijave);
  } catch (err) {
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

export default router;
