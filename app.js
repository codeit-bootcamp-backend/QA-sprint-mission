import express from "express";
import mongoose from "mongoose";
import Product from "./models/product.js";

import * as dotenv from "dotenv";

dotenv.config();
mongoose.connect(process.env.DATABASE_URL).then(() => console.log("Connected to DB"));
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

// 상품 목록 조회
app.get(
  "/products",
  asyncHandler(async (req, res) => {
    /**
     * 쿼리 파라미터
     * - offset : 가져올 데이터의 시작 지점
     * - limit : 한 번에 가져올 데이터의 개수
     * - orderBy : 정렬 기준 favorite, recent (기본값: recent)
     * - keyword : 검색 키워드
     */
    const offset = Number(req.query.offset) || 0;
    const limit = Number(req.query.limit) || 10;
    const orderBy = req.query.orderBy;
    const keyword = req.query.keyword || "";

    const sortOption = orderBy === "favorite" ? { favoriteCount: "desc" } : { createdAt: "desc" };

    // 제목과 내용에서 키워드를 검색하는 쿼리
    const query = keyword
      ? {
          $or: [{ name: { $regex: keyword, $options: "i" } }, { description: { $regex: keyword, $options: "i" } }],
        }
      : {};

    const products = await Product.find(query)
      .select("_id name price images createdAt favoriteCount isFavorite")
      .sort(sortOption)
      .skip(offset)
      .limit(limit);

    const totalProducts = await Product.countDocuments(query);

    res.send({
      products,
      totalProducts,
      currentOffset: offset,
      limit: limit,
    });
  })
);

// 상품 상세 조회
app.get(
  "/products/:id",
  asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id).select("-updatedAt");

    res.send(product);
  })
);

// 상품 등록
app.post(
  "/products",
  asyncHandler(async (req, res) => {
    const newProduct = await Product.create(req.body);
    res.status(201).send(newProduct);
  })
);

// 상품 수정
app.patch(
  "/products/:id",
  asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
      res.status(404).send({ message: "존재하지 않는 상품입니다." });
      return;
    }
    const disallowedFields = {
      favoriteCount: true,
      isFavorite: true,
      ownerId: true,
    };

    Object.keys(req.body).forEach((key) => {
      if (!disallowedFields[key]) {
        product[key] = req.body[key];
      }
    });

    await product.save();

    res.send(product);
  })
);

// 상품 삭제
app.delete(
  "/products/:id",
  asyncHandler(async (req, res) => {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      res.status(404).send({ message: "존재하지 않는 상품입니다." });
      return;
    }

    res.sendStatus(204);
  })
);

// 상품 좋아요
app.patch(
  "/products/:id/like",
  asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
      res.status(404).send({ message: "존재하지 않는 상품입니다." });
      return;
    }

    if (product.isFavorite) {
      res.status(400).send({ message: "이미 좋아요 처리된 상품입니다." });
      return;
    }

    product.favoriteCount += 1;
    product.isFavorite = true;

    await product.save();

    res.send(product);
  })
);

// 상품 좋아요 취소
app.patch(
  "/products/:id/unlike",
  asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
      res.status(404).send({ message: "존재하지 않는 상품입니다." });
      return;
    }

    if (!product.isFavorite) {
      res.status(400).send({ message: "아직 좋아요 처리되지 않은 상품입니다." });
      return;
    }

    if (product.favoriteCount > 0) {
      product.favoriteCount -= 1;
    }
    product.isFavorite = false;

    await product.save();

    res.send(product);
  })
);

app.listen(process.env.PORT || 3000, () => console.log("Server Started"));
