import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

const { JWT_SECRET, JWT_ACCESS_EXPIRES_IN, JWT_REFRESH_EXPIRES_IN } = process.env;

export const generateAccessToken = (user) => {
  return jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: JWT_ACCESS_EXPIRES_IN });
};

export const generateRefreshToken = (user) => {
  return jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: JWT_REFRESH_EXPIRES_IN });
};

export const regenerateRefreshToken = (refreshToken) => {
  try {
    const decoded = jwt.verify(refreshToken, JWT_SECRET);
    return jwt.sign({ userId: decoded.userId }, JWT_SECRET, { expiresIn: "7d" });
  } catch (error) {
    throw new Error("Invalid refresh token");
  }
};
