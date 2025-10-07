import express from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { authMiddleware } from "../middleware/authMiddleware.js";
import User from "../models/User.js";
import Shop from "../models/Shop.js";

const router = express.Router();

// Konfiguracija Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Konfiguracija Multer za file upload
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max
  },
});

// Upload profile image
router.post(
  "/upload-profile",
  authMiddleware,
  upload.single("image"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res
          .status(400)
          .json({ message: "Nijedna slika nije uploadovana" });
      }

      // Convert buffer to base64
      const b64 = Buffer.from(req.file.buffer).toString("base64");
      const dataURI = "data:" + req.file.mimetype + ";base64," + b64;

      // Upload to Cloudinary
      const result = await cloudinary.uploader.upload(dataURI, {
        folder: "profiles",
        public_id: `profile_${req.user.id}`,
        overwrite: true,
        transformation: [
          { width: 300, height: 300, crop: "fill" },
          { quality: "auto" },
          { format: "auto" },
        ],
      });

      // AŽURIRAJ KORISNIKA U BAZI

      await User.findByIdAndUpdate(req.user.id, {
        profileImage: result.secure_url,
      });

      res.json({
        success: true,
        imageUrl: result.secure_url,
        message: "Slika je uspešno uploadovana",
      });
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({ message: "Greška pri uploadu slike" });
    }
  }
);

// Upload shop logo
router.post(
  "/upload-shop-logo",
  authMiddleware,
  upload.single("image"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res
          .status(400)
          .json({ message: "Nijedna slika nije uploadovana" });
      }

      // Pronađi shop povezan sa korisnikom
      const shop = await Shop.findOne({ userId: req.user.id });
      if (!shop) {
        return res.status(404).json({ message: "Shop nije pronađen" });
      }

      // Ako shop već ima logo, obriši ga iz Cloudinary
      if (shop.logo) {
        const oldPublicId = extractPublicIdFromUrl(shop.logo);
        if (oldPublicId) {
          try {
            await cloudinary.uploader.destroy(oldPublicId);
            console.log(`✅ Stari logo obrisan: ${oldPublicId}`);
          } catch (deleteErr) {
            console.error("⚠️ Greška pri brisanju starog logoa:", deleteErr);
          }
        }
      }

      const b64 = Buffer.from(req.file.buffer).toString("base64");
      const dataURI = "data:" + req.file.mimetype + ";base64," + b64;

      const result = await cloudinary.uploader.upload(dataURI, {
        folder: "shop-logos",
        public_id: `shop_logo_${req.user.id}_${Date.now()}`,
        transformation: [
          { height: 300, crop: "scale" }, // Samo visina 300px, širina auto
          { quality: "auto" },
          { format: "auto" },
        ],
      });

      res.json({
        success: true,
        imageUrl: result.secure_url,
        message: "Logo uspešno uploadovan",
      });
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({ message: "Greška pri uploadu logoa" });
    }
  }
);

// Upload vehicle image
router.post(
  "/upload-vehicle",
  authMiddleware,
  upload.single("image"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res
          .status(400)
          .json({ message: "Nijedna slika nije uploadovana" });
      }

      const b64 = Buffer.from(req.file.buffer).toString("base64");
      const dataURI = "data:" + req.file.mimetype + ";base64," + b64;

      const result = await cloudinary.uploader.upload(dataURI, {
        folder: "vehicles",
        public_id: `vehicle_${Date.now()}_${req.user.id}`,
        transformation: [
          { width: 800, height: 600, crop: "limit" },
          { quality: "auto" },
          { format: "auto" },
        ],
      });

      res.json({
        success: true,
        imageUrl: result.secure_url,
      });
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({ message: "Greška pri uploadu slike vozila" });
    }
  }
);

// Dodaj ove funkcije na kraj imagesRoutes.js

// Pomocna funkcija za ekstrakciju public_id iz Cloudinary URL-a
const extractPublicIdFromUrl = (url) => {
  if (!url) return null;

  try {
    const urlParts = url.split("/");
    const uploadIndex = urlParts.indexOf("upload");

    if (uploadIndex !== -1) {
      const pathParts = urlParts.slice(uploadIndex + 2);
      // Ukloni ekstenziju fajla
      return pathParts.join("/").split(".")[0];
    }
  } catch (err) {
    console.error("Greška pri ekstrakciji public_id:", err);
  }

  return null;
};

// Delete profile image
router.delete("/delete-profile-image", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user || !user.profileImage) {
      return res
        .status(400)
        .json({ message: "Nema profilne slike za brisanje" });
    }

    // Ekstrahuj public_id iz URL-a
    const publicId = extractPublicIdFromUrl(user.profileImage);

    if (publicId) {
      // Obriši sa Cloudinary-a
      await cloudinary.uploader.destroy(publicId);
    }

    // Obriši iz baze
    user.profileImage = "";
    await user.save();

    res.json({
      success: true,
      message: "Profilna slika uspešno obrisana",
    });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ message: "Greška pri brisanju profilne slike" });
  }
});

// Delete shop logo
router.delete("/delete-shop-logo", authMiddleware, async (req, res) => {
  try {
    // Prvo nađi shop korisnika

    const shop = await Shop.findOne({ userId: req.user.id });

    if (!shop || !shop.logo) {
      return res.status(400).json({ message: "Nema logoa za brisanje" });
    }

    // Ekstrahuj public_id iz URL-a
    const publicId = extractPublicIdFromUrl(shop.logo);

    if (publicId) {
      // Obriši sa Cloudinary-a
      await cloudinary.uploader.destroy(publicId);
    }

    // Obriši iz baze
    shop.logo = "";
    await shop.save();

    res.json({
      success: true,
      message: "Logo uspešno obrisan",
    });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ message: "Greška pri brisanju logoa" });
  }
});

export default router;
