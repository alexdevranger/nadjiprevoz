import express from "express";
import User from "../models/User.js";
import bcrypt from "bcryptjs"; // 👈 Dodaj ako želiš hash/compare
import jwt from "jsonwebtoken";
import { authMiddleware } from "../middleware/authMiddleware.js";
import dotenv from "dotenv";

dotenv.config();

const users = express.Router();

// ✅ REGISTER
users.post("/register", async (req, res) => {
  const { name, email, password, hasCompany, company, roles } = req.body;

  try {
    // Provera da li korisnik već postoji
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already in use" });
    }

    // Hashuj lozinku
    const hashedPassword = await bcrypt.hash(password, 10);

    // Default role customer ako nije prosleđena
    const userRoles = roles && roles.length > 0 ? roles : ["customer"];

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      hasCompany: hasCompany || false,
      company: hasCompany ? company : undefined,
      roles: userRoles,
    });

    await newUser.save();

    // Kreiraj JWT token
    const token = jwt.sign(
      { id: newUser._id, roles: newUser.roles },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ✅ LOGIN
users.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }
    // console.log(user);

    // Poređenje unete i hashovane lozinke
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid password" });
    }

    // Ovde možeš vratiti token ili korisničke podatke
    const token = jwt.sign(
      { id: user._id, roles: user.roles },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        hasCompany: user.hasCompany,
        company: user.company,
        roles: user.roles,
        banned: user.banned,
        profileImage: user.profileImage || null,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Login failed" });
  }
});

// PUT /api/auth/profile - Ažuriranje profila
users.put("/profile", authMiddleware, async (req, res) => {
  const { id } = req.user; // Dobija se iz JWT tokena
  const { name, company } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { name, company },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ success: true, user: updatedUser });
  } catch (error) {
    res.status(500).json({ error: "Failed to update profile" });
  }
});

// PUT /api/auth/delete-company - Brisanje kompanije
users.put("/delete-company", async (req, res) => {
  const { id } = req.user; // Dobija se iz JWT tokena

  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { hasCompany: false, company: "" },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ success: true, user: updatedUser });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete company" });
  }
});

// ✅ GET - svi korisnici
users.get("/", async (req, res) => {
  try {
    const allUsers = await User.find().select("-password"); // Sakrij password
    res.status(200).json(allUsers);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

export default users;
