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
    /**
     * 쿼리 파라미터
     * - offset : 가져올 데이터의 시작 지점
     * - limit : 한 번에 가져올 데이터의 개수
     * - orderBy : 정렬 기준 favorite, recent (기본값: recent)
     * - keyword : 검색 키워드
     */
    const { offset = 0, limit = 10, orderBy = "recent", keyword = "" } = req.query;
    const order = orderBy === "favorite" ? { favoriteCount: "desc" } : { createdAt: "desc" };
    const products = await prisma.product.findMany({
      orderBy: order,
      skip: parseInt(offset),
      take: parseInt(limit),
      where: {
        OR: [
          {
            name: {
              contains: keyword,
              mode: "insensitive",
            },
          },
          {
            description: {
              contains: keyword,
              mode: "insensitive",
            },
          },
        ],
      },
    });
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
    const product = await prisma.product.update({
      where: {
        id: req.params.id,
      },
      data: {
        favoriteCount: {
          increment: 1,
        },
        isFavorite: true,
      },
    });

    res.send(product);
  })
);

// 상품 좋아요 취소
app.patch(
  "/products/:id/unlike",
  asyncHandler(async (req, res) => {
    const product = await prisma.product.update({
      where: {
        id: req.params.id,
      },
      data: {
        favoriteCount: {
          decrement: 1,
        },
        isFavorite: false,
      },
    });

    res.send(product);
  })
);

app.listen(process.env.PORT || 3000, () => console.log("Server Started"));
