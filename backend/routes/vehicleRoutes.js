import express from "express";
import Vehicle from "../models/Vehicle.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";

const vehicleRouter = express.Router();

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

// Pomoćna funkcija za upload slike na Cloudinary
const uploadToCloudinary = async (file, folder, publicIdPrefix) => {
  try {
    const b64 = Buffer.from(file.buffer).toString("base64");
    const dataURI = "data:" + file.mimetype + ";base64," + b64;

    const result = await cloudinary.uploader.upload(dataURI, {
      folder: folder,
      public_id: `${publicIdPrefix}_${Date.now()}`,
      transformation: [
        { width: 800, height: 600, crop: "limit" },
        { quality: "auto" },
        { format: "auto" },
      ],
    });

    return result.secure_url;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw new Error("Greška pri uploadu slike");
  }
};

// Dodaj vozilo
// vehicleRouter.post("/", authMiddleware, async (req, res) => {
//   try {
//     const vehicle = new Vehicle({
//       ...req.body,
//       userId: req.user.id,
//     });
//     await vehicle.save();
//     res.status(201).json(vehicle);
//   } catch (err) {
//     res.status(500).json({ message: "Greška prilikom dodavanja vozila" });
//   }
// });
vehicleRouter.post(
  "/",
  authMiddleware,
  upload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const vehicleData = {
        ...req.body,
        userId: req.user.id,
      };

      // Ako postoje uploadovane slike, uploaduj ih na Cloudinary
      if (req.files) {
        if (req.files.image1) {
          vehicleData.image1 = await uploadToCloudinary(
            req.files.image1[0],
            "vehicles",
            `vehicle_${req.user.id}`
          );
        }
        if (req.files.image2) {
          vehicleData.image2 = await uploadToCloudinary(
            req.files.image2[0],
            "vehicles",
            `vehicle_${req.user.id}`
          );
        }
      }

      // Parsiranje dimenzija ako su poslate kao string
      if (typeof vehicleData.dimensions === "string") {
        vehicleData.dimensions = JSON.parse(vehicleData.dimensions);
      }

      const vehicle = new Vehicle(vehicleData);
      await vehicle.save();
      // Ažuriraj shop ako korisnik ima shop
      // const shop = await Shop.findOne({ userId: req.user.id });
      // if (shop) {
      //   shop.vehicles.push(vehicle._id);
      //   await shop.save();
      // }
      res.status(201).json(vehicle);
    } catch (err) {
      console.error("Greška pri dodavanju vozila:", err);
      res.status(500).json({ message: "Greška prilikom dodavanja vozila" });
    }
  }
);

// Prikaži vozila samo za ulogovanog korisnika
vehicleRouter.get("/", authMiddleware, async (req, res) => {
  try {
    const vehicles = await Vehicle.find({ userId: req.user.id }).sort({
      capacity: 1,
    });
    res.json(vehicles);
  } catch (err) {
    res.status(500).json({ message: "Greška prilikom učitavanja vozila" });
  }
});

// Izmena vozila
// Izmena vozila
vehicleRouter.put("/:id", authMiddleware, upload.any(), async (req, res) => {
  try {
    console.log("PUT /api/vehicles/:id - Početak");
    console.log("Body:", req.body);
    console.log("Files:", req.files ? req.files.length : 0);

    const vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
      console.log("Vozilo nije pronađeno");
      return res.status(404).json({ message: "Vozilo nije pronađeno" });
    }

    // Proveri da li korisnik ima pravo da menja ovo vozilo
    if (vehicle.userId.toString() !== req.user.id) {
      console.log("Korisnik nema pravo da menja ovo vozilo");
      return res
        .status(403)
        .json({ message: "Nemaš pravo da menjaš ovo vozilo" });
    }

    // Obradi brisanje slika
    if (req.body.removeImage1 === "true") {
      console.log("Brisanje image1");
      vehicle.image1 = "";
    }
    if (req.body.removeImage2 === "true") {
      console.log("Brisanje image2");
      vehicle.image2 = "";
    }

    // Obradi uploadovane slike
    if (req.files && req.files.length > 0) {
      console.log("Obrada uploadovanih fajlova:", req.files.length);
      for (const file of req.files) {
        try {
          console.log("Obrada fajla:", file.fieldname, file.originalname);

          if (file.fieldname === "image1") {
            console.log("Upload image1 na Cloudinary");
            // Upload to Cloudinary koristeći buffer (ne path)
            const result = await uploadToCloudinary(
              file,
              "vehicles",
              `vehicle_${req.user.id}_${req.params.id}`
            );
            vehicle.image1 = result;
            console.log("Image1 uploadovan:", result);
          } else if (file.fieldname === "image2") {
            console.log("Upload image2 na Cloudinary");
            const result = await uploadToCloudinary(
              file,
              "vehicles",
              `vehicle_${req.user.id}_${req.params.id}`
            );
            vehicle.image2 = result;
            console.log("Image2 uploadovan:", result);
          }
        } catch (uploadError) {
          console.error("Greška pri uploadu slike:", uploadError);
          // Nastavi sa drugim poljima ako upload slike ne uspe
        }
      }
    }

    // Ažuriraj ostale podatke
    console.log("Ažuriranje ostalih podataka");
    Object.keys(req.body).forEach((key) => {
      if (key !== "removeImage1" && key !== "removeImage2") {
        if (key === "dimensions") {
          try {
            console.log("Parsiranje dimenzija:", req.body.dimensions);
            vehicle.dimensions = JSON.parse(req.body.dimensions);
          } catch (e) {
            console.error("Greška pri parsiranju dimenzija:", e);
          }
        } else {
          console.log(`Ažuriranje ${key}: ${req.body[key]}`);
          vehicle[key] = req.body[key];
        }
      }
    });

    console.log("Čuvanje vozila u bazi");
    await vehicle.save();
    console.log("Vozilo uspešno sačuvano");

    res.json(vehicle);
  } catch (err) {
    console.error("Greška pri izmeni vozila:", err);
    console.error("Stack trace:", err.stack);
    res.status(500).json({ message: "Greška pri izmeni vozila" });
  }
});
// vehicleRouter.put("/:id", authMiddleware, upload.any(), async (req, res) => {
//   try {
//     const vehicle = await Vehicle.findById(req.params.id);

//     if (!vehicle) {
//       return res.status(404).json({ message: "Vozilo nije pronađeno" });
//     }

//     // Proveri da li korisnik ima pravo da menja ovo vozilo
//     if (vehicle.userId.toString() !== req.user.id) {
//       return res
//         .status(403)
//         .json({ message: "Nemaš pravo da menjaš ovo vozilo" });
//     }

//     // Obradi brisanje slika
//     if (req.body.removeImage1 === "true") {
//       vehicle.image1 = "";
//     }
//     if (req.body.removeImage2 === "true") {
//       vehicle.image2 = "";
//     }

//     // Obradi uploadovane slike
//     if (req.files && req.files.length > 0) {
//       for (const file of req.files) {
//         if (file.fieldname === "image1") {
//           // Upload to Cloudinary i sačuvaj URL
//           const result = await cloudinary.uploader.upload(file.path);
//           vehicle.image1 = result.secure_url;
//         } else if (file.fieldname === "image2") {
//           const result = await cloudinary.uploader.upload(file.path);
//           vehicle.image2 = result.secure_url;
//         }
//       }
//     }

//     // Ažuriraj ostale podatke
//     Object.keys(req.body).forEach((key) => {
//       if (key !== "removeImage1" && key !== "removeImage2") {
//         if (key === "dimensions") {
//           vehicle.dimensions = JSON.parse(req.body.dimensions);
//         } else {
//           vehicle[key] = req.body[key];
//         }
//       }
//     });

//     await vehicle.save();
//     res.json(vehicle);
//   } catch (err) {
//     console.error("Greška pri izmeni vozila:", err);
//     res.status(500).json({ message: "Greška pri izmeni vozila" });
//   }
// });
// vehicleRouter.put(
//   "/:id",
//   authMiddleware,
//   upload.fields([
//     { name: "image1", maxCount: 1 },
//     { name: "image2", maxCount: 1 },
//   ]),
//   async (req, res) => {
//     try {
//       const updateData = { ...req.body };

//       // Ako postoje uploadovane slike, uploaduj ih na Cloudinary
//       if (req.files) {
//         if (req.files.image1) {
//           updateData.image1 = await uploadToCloudinary(
//             req.files.image1[0],
//             "vehicles",
//             `vehicle_${req.user.id}`
//           );
//         }
//         if (req.files.image2) {
//           updateData.image2 = await uploadToCloudinary(
//             req.files.image2[0],
//             "vehicles",
//             `vehicle_${req.user.id}`
//           );
//         }
//       }

//       // Parsiranje dimenzija ako su poslate kao string
//       if (typeof updateData.dimensions === "string") {
//         updateData.dimensions = JSON.parse(updateData.dimensions);
//       }

//       const vehicle = await Vehicle.findOneAndUpdate(
//         { _id: req.params.id, userId: req.user.id },
//         updateData,
//         { new: true }
//       );

//       if (!vehicle)
//         return res.status(404).json({ message: "Vozilo nije pronađeno" });
//       res.json(vehicle);
//     } catch (err) {
//       console.error("Greška pri izmeni vozila:", err);
//       res.status(500).json({ message: "Greška prilikom izmene vozila" });
//     }
//   }
// );

// Brisanje slike vozila
vehicleRouter.delete("/:id/image", authMiddleware, async (req, res) => {
  try {
    const { imageField } = req.body; // 'image1' ili 'image2'
    const vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
      return res.status(404).json({ message: "Vozilo nije pronađeno" });
    }

    // Proveri da li korisnik ima pravo da menja ovo vozilo
    if (vehicle.userId.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Nemaš pravo da menjaš ovo vozilo" });
    }

    // Ekstrahuj public_id iz Cloudinary URL-a pre brisanja
    const imageUrl = vehicle[imageField];
    let publicId = null;

    if (imageUrl) {
      // Ekstrakcija public_id iz Cloudinary URL-a
      const urlParts = imageUrl.split("/");
      const uploadIndex = urlParts.indexOf("upload");
      if (uploadIndex !== -1) {
        publicId = urlParts
          .slice(uploadIndex + 2)
          .join("/")
          .split(".")[0];
      }
    }

    // Obriši sliku iz baze
    vehicle[imageField] = "";
    await vehicle.save();

    // Obriši sliku sa Cloudinary-a ako postoji public_id
    if (publicId) {
      try {
        await cloudinary.uploader.destroy(publicId);
        console.log(`Slika ${publicId} obrisana sa Cloudinary-a`);
      } catch (cloudinaryErr) {
        console.error("Greška pri brisanju sa Cloudinary:", cloudinaryErr);
        // Nastavi dalje čak i ako Cloudinary brisanje ne uspe
      }
    }

    res.json({ success: true, message: "Slika uspešno obrisana" });
  } catch (err) {
    console.error("Greška pri brisanju slike:", err);
    res.status(500).json({ message: "Greška pri brisanju slike" });
  }
});

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

// Brisanje vozila
// vehicleRouter.delete("/:id", authMiddleware, async (req, res) => {
//   try {
//     const vehicle = await Vehicle.findOneAndDelete({
//       _id: req.params.id,
//       userId: req.user.id,
//     });
//     if (!vehicle)
//       return res.status(404).json({ message: "Vozilo nije pronađeno" });
//     res.json({ message: "Vozilo obrisano" });
//   } catch (err) {
//     res.status(500).json({ message: "Greška prilikom brisanja vozila" });
//   }
// });
// U DELETE endpointu za brisanje vozila
vehicleRouter.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle || vehicle.userId.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Nemaš pravo da obrišeš ovo vozilo" });
    }

    // Obriši slike sa Cloudinary-a pre brisanja vozila
    const imagesToDelete = [];

    if (vehicle.image1) {
      const publicId1 = extractPublicIdFromUrl(vehicle.image1);
      if (publicId1) imagesToDelete.push(publicId1);
    }

    if (vehicle.image2) {
      const publicId2 = extractPublicIdFromUrl(vehicle.image2);
      if (publicId2) imagesToDelete.push(publicId2);
    }

    // Obriši vozilo iz baze
    await Vehicle.findByIdAndDelete(req.params.id);

    // Obriši slike sa Cloudinary-a (u pozadini, ne blokiraj response)
    if (imagesToDelete.length > 0) {
      Promise.all(
        imagesToDelete.map((publicId) =>
          cloudinary.uploader
            .destroy(publicId)
            .catch((err) =>
              console.error(`Greška pri brisanju ${publicId}:`, err)
            )
        )
      ).then(() => {
        console.log(
          `Obrisane ${imagesToDelete.length} slike za vozilo ${req.params.id}`
        );
      });
    }

    res.json({ success: true, message: "Vozilo uspešno obrisano" });
  } catch (err) {
    console.error("Greška pri brisanju vozila:", err);
    res.status(500).json({ message: "Greška pri brisanju vozila" });
  }
});

export default vehicleRouter;
