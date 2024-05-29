import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { assert } from "superstruct";
import { createUser, findUserByEmail, findUserById, validatePassword } from "../services/authService.js";
import { CreateUser } from "../structs.js";
import { generateAccessToken, generateRefreshToken, regenerateRefreshToken } from "../utils/tokens.js";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

export const signUp = async (req, res) => {
  const { email, password, name, nickname } = req.body;
  assert(req.body, CreateUser);

  const existingUser = await findUserByEmail(email);

  if (existingUser) {
    return res.status(400).json({ message: "이미 가입된 이메일입니다." });
  }

  await createUser(email, password, name, nickname);

  res.status(201).json({ message: "회원가입이 완료되었습니다." });
};

export const signIn = async (req, res) => {
  const { email, password } = req.body;

  const user = await findUserByEmail(email);

  if (!user) {
    return res.status(401).json({ message: "이메일과 비밀번호를 확인해주세요." });
  }

  const isPasswordValid = await validatePassword(password, user.password);

  if (!isPasswordValid) {
    return res.status(401).json({ message: "이메일과 비밀번호를 확인해주세요." });
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  res.json({ accessToken, refreshToken });
};

export const refreshToken = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ message: "토큰은 필수값입니다." });
  }

  try {
    const newRefreshToken = regenerateRefreshToken(refreshToken);
    const decoded = jwt.verify(newRefreshToken, JWT_SECRET);
    const user = await findUserById(decoded.userId);

    if (!user) {
      return res.status(401).json({ message: "유효하지 않은 토큰입니다." });
    }

    const accessToken = generateAccessToken(user);

    res.json({ accessToken, refreshToken: newRefreshToken });
  } catch (error) {
    return res.status(401).json({ message: "유효하지 않은 토큰입니다." });
  }
};

export const googleCallback = (req, res) => {
  const { accessToken, refreshToken } = req.user;
  res.json({ accessToken, refreshToken });
};
