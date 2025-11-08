//backend/serviceRoutes/js
import express from "express";
import Service from "../models/Service.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";

const router = express.Router();

// Cloudinary config - OBAVEZNO postavi env var-ove
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer memory storage (u buffer) kao u tvom primeru
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 6 * 1024 * 1024 }, // 6MB max
});

// Helper za upload buffer -> Cloudinary
const uploadToCloudinary = async (
  file,
  folder = "services",
  publicIdPrefix = "service"
) => {
  try {
    const b64 = Buffer.from(file.buffer).toString("base64");
    const dataURI = `data:${file.mimetype};base64,${b64}`;
    const result = await cloudinary.uploader.upload(dataURI, {
      folder,
      public_id: `${publicIdPrefix}_${Date.now()}`,
      transformation: [
        { width: 360, height: 160, crop: "limit" },
        { quality: "auto" },
        { format: "auto" },
      ],
    });
    return result.secure_url;
  } catch (err) {
    console.error("Cloudinary upload error:", err);
    throw new Error("Greška pri uploadu slike");
  }
};

/**
 * Routes:
 * GET /api/services -> javni (mogu se filtrirati query param: city)
 * GET /api/services/:id -> javni
 * GET /api/services/my -> auth -> samo za ulogovanog korisnika (njegovi servisi)
 * POST /api/services -> auth + banner upload (multipart/form-data)
 * PUT /api/services/:id -> auth + banner upload (multipart/form-data)
 * DELETE /api/services/:id -> auth
 */

// Public - lista servisa (može filter by city)
router.get("/", async (req, res) => {
  try {
    const { city, type } = req.query;
    const filter = {};
    if (city) filter.city = new RegExp(city, "i");
    if (type) filter.type = new RegExp(type, "i");

    const services = await Service.find(filter).sort({ createdAt: -1 });
    res.json(services);
  } catch (err) {
    console.error("GET /api/service-ads error:", err);
    res.status(500).json({ message: "Greška pri učitavanju servisa" });
  }
});

// Auth - get services for logged in user
router.get("/my", authMiddleware, async (req, res) => {
  try {
    const services = await Service.find({ userId: req.user.id }).sort({
      createdAt: -1,
    });
    res.json(services);
  } catch (err) {
    console.error("GET /api/service-ads/my error:", err);
    res.status(500).json({ message: "Greška pri učitavanju vaših servisa" });
  }
});

// Public - get by id
router.get("/:id", async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service)
      return res.status(404).json({ message: "Servis nije pronađen" });
    res.json(service);
  } catch (err) {
    console.error("GET /api/service-ads/:id error:", err);
    res.status(500).json({ message: "Greška pri učitavanju servisa" });
  }
});

// Create service
router.post("/", authMiddleware, upload.single("banner"), async (req, res) => {
  try {
    const payload = {
      userId: req.user.id,
      serviceName: req.body.serviceName,
      type: req.body.type,
      city: req.body.city,
      adresa: req.body.adresa,
      telefon1: req.body.telefon1,
      telefon2: req.body.telefon2,
      description: req.body.description,
      active: req.body.active === "false" ? false : true,
    };

    // lokacija može doći kao JSON string ili pojedinačno polje
    if (req.body.lokacija) {
      try {
        const parsed =
          typeof req.body.lokacija === "string"
            ? JSON.parse(req.body.lokacija)
            : req.body.lokacija;
        if (parsed.lat && parsed.lng)
          payload.lokacija = { lat: parsed.lat, lng: parsed.lng };
      } catch (e) {
        // ignore parse error
      }
    } else if (req.body.lat && req.body.lng) {
      payload.lokacija = {
        lat: Number(req.body.lat),
        lng: Number(req.body.lng),
      };
    }

    // Upload bannera ako postoji
    if (req.file) {
      const url = await uploadToCloudinary(
        req.file,
        "services",
        `service_${req.user.id}`
      );
      payload.banner = url;
    }

    const service = new Service(payload);
    await service.save();
    res.status(201).json(service);
  } catch (err) {
    console.error("POST /api/service-ads error:", err);
    res.status(500).json({ message: "Greška pri kreiranju servisa" });
  }
});

// Update service
router.put(
  "/:id",
  authMiddleware,
  upload.single("banner"),
  async (req, res) => {
    try {
      const service = await Service.findById(req.params.id);
      if (!service)
        return res.status(404).json({ message: "Servis nije pronađen" });

      if (service.userId.toString() !== req.user.id) {
        return res
          .status(403)
          .json({ message: "Nemaš pravo da menjaš ovaj servis" });
      }

      // Ako frontend šalje flag za brisanje bannera: removeBanner=true
      if (req.body.removeBanner === "true") {
        service.banner = "";
      }

      // Ako je uploadan novi banner -> uploaduj i zameni
      if (req.file) {
        try {
          const url = await uploadToCloudinary(
            req.file,
            "services",
            `service_${req.user.id}_${req.params.id}`
          );
          service.banner = url;
        } catch (uploadErr) {
          console.error("Banner upload error on update:", uploadErr);
          // nastavi dalje
        }
      }

      // Ažuriraj ostalo iz body-a
      const updatable = [
        "serviceName",
        "type",
        "city",
        "adresa",
        "telefon1",
        "telefon2",
        "description",
        "active",
      ];
      updatable.forEach((k) => {
        if (Object.prototype.hasOwnProperty.call(req.body, k)) {
          // cast aktivno boolean
          if (k === "active") {
            service[k] = req.body[k] === "false" ? false : true;
          } else {
            service[k] = req.body[k];
          }
        }
      });

      // lokacija update
      if (req.body.lokacija) {
        try {
          const parsed =
            typeof req.body.lokacija === "string"
              ? JSON.parse(req.body.lokacija)
              : req.body.lokacija;
          if (parsed.lat && parsed.lng)
            service.lokacija = { lat: parsed.lat, lng: parsed.lng };
        } catch (e) {}
      } else if (req.body.lat && req.body.lng) {
        service.lokacija = {
          lat: Number(req.body.lat),
          lng: Number(req.body.lng),
        };
      }

      await service.save();
      res.json(service);
    } catch (err) {
      console.error("PUT /api/service-ads/:id error:", err);
      res.status(500).json({ message: "Greška pri izmeni servisa" });
    }
  }
);

// Delete service
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service)
      return res.status(404).json({ message: "Servis nije pronađen" });

    if (service.userId.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Nemaš pravo da brišeš ovaj servis" });
    }

    await service.remove();
    res.json({ message: "Servis obrisan" });
  } catch (err) {
    console.error("DELETE /api/service-ads/:id error:", err);
    res.status(500).json({ message: "Greška pri brisanju servisa" });
  }
});

export default router;
