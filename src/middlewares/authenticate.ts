import dotenv from "dotenv";
import { NextFunction, Request, RequestHandler, Response } from "express";
import jwt from "jsonwebtoken";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";

export interface UserRequest extends Request {
  userId: number;
}

const authenticate: RequestHandler = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(401).json({ message: "인증 토큰이 제공되지 않았습니다." });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
    (req as UserRequest).userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ message: "올바르지 않은 토큰입니다." });
  }
};

export default authenticate;
