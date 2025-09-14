import express from "express";
import Shop from "../models/Shop.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import Vehicle from "../models/Vehicle.js";
import { v2 as cloudinary } from "cloudinary";

const shopRouter = express.Router();

// Konfiguracija Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Provera dostupnosti sluga
shopRouter.get("/check-slug/:slug", async (req, res) => {
  try {
    const { slug } = req.params;
    const existingShop = await Shop.findOne({ slug });

    res.json({ available: !existingShop });
  } catch (err) {
    res.status(500).json({ message: "Greška pri proveri sluga" });
  }
});

// Kreiranje shopa
shopRouter.post("/", authMiddleware, async (req, res) => {
  try {
    const { name, companyName, address, logo, description, specialization } =
      req.body;

    // Proveri da li korisnik već ima shop
    const existingShop = await Shop.findOne({ userId: req.user.id });
    if (existingShop) {
      return res.status(400).json({ message: "Već imate kreiran shop" });
    }

    // Proveri da li korisnik ima vozila
    const userVehicles = await Vehicle.find({ userId: req.user.id });
    if (userVehicles.length === 0) {
      return res.status(400).json({
        message: "Morate imati bar jedno vozilo da biste kreirali shop",
      });
    }

    // Automatski generiši slug
    let slug = name
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();

    // Proveri jedinstvenost sluga
    let counter = 1;
    let originalSlug = slug;
    while (await Shop.findOne({ slug })) {
      slug = `${originalSlug}-${counter}`;
      counter++;
    }

    // Napravi listu ID-eva svih vozila korisnika
    const vehicleIds = userVehicles.map((vehicle) => vehicle._id);

    const shop = new Shop({
      userId: req.user.id,
      name,
      slug,
      companyName,
      address,
      logo,
      description,
      specialization,
      vehicles: vehicleIds,
      contact: {
        email: req.user.email,
        phone: req.user.phone,
      },
    });

    await shop.save();
    await shop.populate("vehicles");
    res.status(201).json(shop);
  } catch (err) {
    console.error("Greška pri kreiranju shopa:", err);
    res.status(500).json({ message: "Greška pri kreiranju shopa" });
  }
});

// Dobijanje shopa po slug-u (javni endpoint)
shopRouter.get("/:slug", async (req, res) => {
  try {
    const { slug } = req.params;
    const shop = await Shop.findOne({ slug, isActive: true })
      .populate("vehicles")
      .populate("userId", "name email phone");

    if (!shop) {
      return res.status(404).json({ message: "Shop nije pronađen" });
    }

    res.json({ shop });
  } catch (err) {
    console.error("Greška pri učitavanju shopa:", err);
    res.status(500).json({ message: "Greška pri učitavanju shopa" });
  }
});

// Dobijanje shopa za ulogovanog korisnika
shopRouter.get("/", authMiddleware, async (req, res) => {
  try {
    const shop = await Shop.findOne({ userId: req.user.id }).populate(
      "vehicles"
    );

    res.json(shop);
  } catch (err) {
    console.error("Greška pri učitavanju shopa:", err);
    res.status(500).json({ message: "Greška pri učitavanju shopa" });
  }
});

// Ažuriranje shopa
shopRouter.put("/:id", authMiddleware, async (req, res) => {
  try {
    const shop = await Shop.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!shop) {
      return res.status(404).json({ message: "Shop nije pronađen" });
    }

    res.json(shop);
  } catch (err) {
    console.error("Greška pri ažuriranju shopa:", err);
    res.status(500).json({ message: "Greška pri ažuriranju shopa" });
  }
});

// Dodavanje usluge
shopRouter.post("/:id/services", authMiddleware, async (req, res) => {
  try {
    const { name, description, icon } = req.body;
    const shop = await Shop.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!shop) {
      return res.status(404).json({ message: "Shop nije pronađen" });
    }

    shop.services.push({ name, description, icon });
    await shop.save();

    res.json(shop);
  } catch (err) {
    console.error("Greška pri dodavanju usluge:", err);
    res.status(500).json({ message: "Greška pri dodavanju usluge" });
  }
});

// Brisanje usluge
shopRouter.delete(
  "/:id/services/:serviceId",
  authMiddleware,
  async (req, res) => {
    try {
      const shop = await Shop.findOne({
        _id: req.params.id,
        userId: req.user.id,
      });

      if (!shop) {
        return res.status(404).json({ message: "Shop nije pronađen" });
      }

      shop.services = shop.services.filter(
        (service) => service._id.toString() !== req.params.serviceId
      );

      await shop.save();
      res.json(shop);
    } catch (err) {
      console.error("Greška pri brisanju usluge:", err);
      res.status(500).json({ message: "Greška pri brisanju usluge" });
    }
  }
);

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

// Brisanje shopa
shopRouter.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const shop = await Shop.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!shop) {
      return res.status(404).json({ message: "Shop nije pronađen" });
    }

    // Obriši logo sa Cloudinary-a pre brisanja shopa
    if (shop.logo) {
      const publicId = extractPublicIdFromUrl(shop.logo);

      if (publicId) {
        try {
          await cloudinary.uploader.destroy(publicId);
          console.log(`Shop logo ${publicId} obrisan sa Cloudinary-a`);
        } catch (cloudinaryErr) {
          console.error(
            "Greška pri brisanju logoa sa Cloudinary:",
            cloudinaryErr
          );
          // Nastavi sa brisanjem shopa čak i ako Cloudinary brisanje ne uspe
        }
      }
    }

    // Obriši shop iz baze
    await Shop.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    res.json({ success: true, message: "Shop uspešno obrisan" });
  } catch (err) {
    console.error("Greška pri brisanju shopa:", err);
    res.status(500).json({ message: "Greška pri brisanju shopa" });
  }
});
// Brisanje shopa
// shopRouter.delete("/:id", authMiddleware, async (req, res) => {
//   try {
//     const shop = await Shop.findOneAndDelete({
//       _id: req.params.id,
//       userId: req.user.id,
//     });

//     if (!shop) {
//       return res.status(404).json({ message: "Shop nije pronađen" });
//     }

//     res.json({ success: true, message: "Shop uspešno obrisan" });
//   } catch (err) {
//     console.error("Greška pri brisanju shopa:", err);
//     res.status(500).json({ message: "Greška pri brisanju shopa" });
//   }
// });

export default shopRouter;
