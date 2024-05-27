import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import express from "express";
import jwt from "jsonwebtoken";
import { assert } from "superstruct";
import { CreateUser } from "../structs.js";
import asyncHandler from "../utils/asyncHandler.js";
import { generateAccessToken, generateRefreshToken } from "../utils/tokens.js";

dotenv.config();
const router = express.Router();
const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET;

// 회원가입
router.post(
  "/signUp",
  asyncHandler(async (req, res) => {
    const { email, password, name, nickname } = req.body;
    assert(req.body, CreateUser);
    const hashedPassword = await bcrypt.hash(password, 10);
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ message: "이미 가입된 이메일입니다." });
    }

    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        nickname,
      },
    });

    res.status(201).json({ message: "회원가입이 완료되었습니다." });
  })
);
// 사용자 로그인
router.post(
  "/signIn",
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({ message: "이메일과 비밀번호를 확인해주세요." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "이메일과 비밀번호를 확인해주세요." });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.json({ accessToken, refreshToken });
  })
);

router.post(
  "/refresh-token",
  asyncHandler(async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ message: "토큰은 필수값입니다." });
    }

    try {
      const decoded = jwt.verify(refreshToken, JWT_SECRET);
      const user = await prisma.user.findUnique({ where: { id: decoded.userId } });

      if (!user) {
        return res.status(401).json({ message: "유효하지 않은 토큰입니다." });
      }

      const accessToken = generateAccessToken(user);

      res.json({ accessToken });
    } catch (error) {
      return res.status(401).json({ message: "유효하지 않은 토큰입니다." });
    }
  })
);

export default router;
