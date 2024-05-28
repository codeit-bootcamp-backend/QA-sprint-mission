import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "kingPanda";
const JWT_ACCESS_EXPIRES_IN = process.env.JWT_ACCESS_EXPIRES_IN || "15m";
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || "7d";

export const generateAccessToken = (user) => {
  return jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: JWT_ACCESS_EXPIRES_IN });
};

export const generateRefreshToken = (user) => {
  return jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: JWT_REFRESH_EXPIRES_IN });
};

export const regenerateRefreshToken = (refreshToken) => {
  try {
    const decoded = jwt.verify(refreshToken, JWT_SECRET);
    return jwt.sign({ userId: decoded.userId }, JWT_SECRET, { expiresIn: JWT_REFRESH_EXPIRES_IN });
  } catch (error) {
    throw new Error("Invalid refresh token");
  }
};
