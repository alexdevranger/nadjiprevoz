import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "./models/User.js"; // putanja do tvog User modela
import connectDB from "./db.js";

dotenv.config();

const dbURL =
  process.env.MONGO_URI || "mongodb://localhost:27017/transport-app-v5";
connectDB(dbURL);

const createAdmin = async () => {
  try {
    const email = "admin@gmail.com"; // promeni na svoj email
    const existing = await User.findOne({ email });
    if (existing) {
      console.log("Admin already exists");
      return process.exit(0);
    }

    const hashedPassword = await bcrypt.hash("123456", 10); // promeni na željenu lozinku

    const admin = new User({
      name: "Admin",
      email,
      password: hashedPassword,
      roles: ["admin"],
    });

    await admin.save();
    console.log("Admin created successfully");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

createAdmin();
