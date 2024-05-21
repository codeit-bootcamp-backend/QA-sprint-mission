import express from "express";
import mongoose from "mongoose";
import { DATABASE_URL } from "./env.js";
import Product from "./models/product.js";

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

app.get(
  "/products",
  asyncHandler(async (req, res) => {
    /**
     * 쿼리 파라미터
     * - page : 페이지 번호
     * - pageSize : 페이지 당 상품 수
     * - orderBy : 정렬 기준 favorite, recent (기본값: recent)
     * - keyword : 검색 키워드
     */
    const orderBy = req.query.sort;
    const count = Number(req.query.count) || 0;

    const sortOption = orderBy === "favorite" ? { favoriteCount: "desc" } : { createdAt: "desc" };

    const product = await Product.find().sort(sortOption).limit(count);

    res.send(product);
  })
);

app.post(
  "/products",
  asyncHandler(async (req, res) => {
    const newProduct = await Product.create(req.body);
    res.status(201).send(newProduct);
  })
);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
