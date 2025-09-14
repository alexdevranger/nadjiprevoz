import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "./models/User.js"; // putanja do tvog User modela

dotenv.config();

const MONGO_URI = process.env.MONGO_URI; // npr. mongodb://localhost:27017/tvojaBaza

async function updatePassword() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");

    const email = "admin@example.com"; // admin email
    const newPassword = "NovaLozinka123"; // nova lozinka

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const user = await User.findOneAndUpdate(
      { email },
      { password: hashedPassword },
      { new: true }
    );

    if (!user) {
      console.log("Admin korisnik nije pronađen");
    } else {
      console.log(`Lozinka uspešno promenjena za: ${user.email}`);
    }

    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  } catch (err) {
    console.error(err);
  }
}

updatePassword();
