import dotenv from "dotenv";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { StructError, assert } from "superstruct";
import { createUser, findUserByEmail, findUserById, validatePassword } from "../services/authService";
import { CreateUser } from "../structs";
import { generateAccessToken, generateRefreshToken, regenerateRefreshToken } from "../utils/tokens";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "kingPanda";

export const signUp = async (req: Request, res: Response) => {
  try {
    const { email, password, name, nickname } = req.body;
    assert(req.body, CreateUser);

    const existingUser = await findUserByEmail(email);

    if (existingUser) {
      res.status(400).json({ message: "이미 가입된 이메일입니다." });
      return;
    }

    await createUser(email, password, name, nickname);

    res.status(201).json({ message: "회원가입이 완료되었습니다." });
  } catch (error) {
    if (error instanceof StructError) {
      const errorMessages = new Set();
      const uniqueFailures = [];

      for (const failure of error.failures()) {
        const errorMessage = JSON.stringify({ path: failure.path.join("."), message: failure.message });
        if (!errorMessages.has(errorMessage)) {
          errorMessages.add(errorMessage);
          uniqueFailures.push({ path: failure.path.join("."), message: failure.message });
        }
      }

      res.status(400).json({
        message: "유효성 검사 오류입니다.",
        errors: uniqueFailures,
      });
    } else {
      res.status(500).json({ message: "서버 에러입니다." });
    }
  }
};

export const signIn = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: "이메일과 비밀번호를 입력해주세요." });
    return;
  }

  const user = await findUserByEmail(email);

  if (!user || !user.password) {
    res.status(401).json({ message: "이메일과 비밀번호를 확인해주세요." });
    return;
  }

  const isPasswordValid = await validatePassword(password, user.password);

  if (!isPasswordValid) {
    res.status(401).json({ message: "이메일과 비밀번호를 확인해주세요." });
    return;
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  res.json({ accessToken, refreshToken });
};

export const refreshToken = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    res.status(401).json({ message: "토큰은 필수값입니다." });
    return;
  }

  try {
    const newRefreshToken = regenerateRefreshToken(refreshToken);
    const decoded = jwt.verify(newRefreshToken, JWT_SECRET) as { userId: number };
    req.user = { _id: decoded.userId };
    const user = await findUserById(decoded.userId);

    if (!user) {
      res.status(401).json({ message: "유효하지 않은 토큰입니다." });
      return;
    }

    const accessToken = generateAccessToken(user);

    res.json({ accessToken, refreshToken: newRefreshToken });
  } catch (error) {
    res.status(401).json({ message: "유효하지 않은 토큰입니다." });
    return;
  }
};

export const googleCallback = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    next(new Error("사용자 정보를 찾을 수 없습니다."));
    return;
  }
  const { accessToken, refreshToken } = req.user;
  res.json({ accessToken, refreshToken });
};
