import { PrismaClient } from "@prisma/client";
import express from "express";
const prisma = new PrismaClient();

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
    const products = await prisma.product.findMany();
    res.send(products);
  })
);

// 상품 상세 조회
app.get(
  "/products/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const product = await prisma.product.findUnique({
      where: {
        id,
      },
    });
    if (!product) {
      res.status(404).send({ message: "존재하지 않는 상품입니다." });
      return;
    }

    res.send(product);
  })
);

// 상품 등록
app.post(
  "/products",
  asyncHandler(async (req, res) => {
    const product = await prisma.product.create({
      data: req.body,
    });
    res.status(201).send(product);
  })
);

// 상품 수정
app.patch(
  "/products/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const product = await prisma.product.update({
      where: {
        id,
      },
      data: req.body,
    });
    if (!product) {
      res.status(404).send({ message: "존재하지 않는 상품입니다." });
      return;
    }

    res.send(product);
  })
);

// 상품 삭제
app.delete(
  "/products/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const product = await prisma.product.delete({
      where: {
        id,
      },
    });

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
