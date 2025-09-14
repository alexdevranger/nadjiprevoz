import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const adminAuthMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token nedostaje" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: "Korisnik ne postoji" });
    }

    req.user = user;

    // Provera role
    if (!user.roles.includes("admin") && !user.roles.includes("moderator")) {
      return res.status(403).json({ message: "Nemate dozvolu" });
    }

    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: "Neispravan token" });
  }
};
