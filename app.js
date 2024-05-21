import express from "express";
import mongoose from "mongoose";
import { DATABASE_URL } from "./env.js";

mongoose.connect(DATABASE_URL).then(() => console.log("Connected to DB"));
const app = express();

app.use(express.json());

const asyncHandler = (handler) => {
  return async (req, res) => {
    try {
      await handler(req, res);
    } catch (e) {
      if (e.name === "ValidationError") {
        res.status(400).send({ message: e.message });
      } else if (e.name === "CastError") {
        res.status(404).send({ message: "존재하지 않는 상품입니다." });
      } else {
        res.status(500).send({ message: "서버 에러입니다." });
      }
    }
  };
};
