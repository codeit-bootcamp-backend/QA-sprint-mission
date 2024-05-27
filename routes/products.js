import { PrismaClient } from "@prisma/client";
import express from "express";
import { assert } from "superstruct";
import { CreateComment, CreateProduct, PatchComment, PatchProduct } from "../structs.js";
import asyncHandler from "../utils/asyncHandler.js";

const prisma = new PrismaClient();
const router = express.Router(); // 상품 목록 조회
router.get(
  "/",
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
router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const product = await prisma.product.findUniqueOrThrow({
      where: {
        id,
      },
    });
    res.send(product);
  })
);

// 상품 등록
router.post(
  "/",
  asyncHandler(async (req, res) => {
    assert(req.body, CreateProduct);
    const product = await prisma.product.create({
      data: req.body,
    });
    res.status(201).send(product);
  })
);

// 상품 수정
router.patch(
  "/:id",
  asyncHandler(async (req, res) => {
    assert(req.body, PatchProduct);
    const { id } = req.params;
    const product = await prisma.product.update({
      where: {
        id,
      },
      data: req.body,
    });

    res.send(product);
  })
);

// 상품 삭제
router.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    await prisma.product.delete({
      where: {
        id,
      },
    });

    res.sendStatus(204);
  })
);

// 상품 좋아요
router.patch(
  "/:id/like",
  asyncHandler(async (req, res) => {
    const product = await prisma.product.findUniqueOrThrow({
      where: {
        id: req.params.id,
      },
    });

    if (product.isFavorite) {
      res.status(400).send({ message: "이미 좋아요 처리된 상품입니다." });
      return;
    }

    const updatedProduct = await prisma.product.update({
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

    res.send(updatedProduct);
  })
);

// 상품 좋아요 취소
router.patch(
  "/:id/unlike",
  asyncHandler(async (req, res) => {
    const product = await prisma.product.findUniqueOrThrow({
      where: {
        id: req.params.id,
      },
    });

    if (!product.isFavorite) {
      res.status(400).send({ message: "아직 좋아요 처리되지 않은 상품입니다." });
      return;
    }

    const updatedProduct = await prisma.product.update({
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

    res.send(updatedProduct);
  })
);

// 중고마켓 댓글 목록 조회
router.get(
  "/:id/comments",
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { cursor } = req.query;
    let queryOptions = {
      take: 10,
      orderBy: {
        createdAt: "desc",
      },
      where: {
        productId: id,
      },
      select: {
        id: true,
        content: true,
        createdAt: true,
        writer: true,
      },
    };

    if (cursor) {
      queryOptions = {
        ...queryOptions,
        cursor: {
          id: cursor,
        },
        skip: 1,
      };
    }

    const comments = await prisma.comment.findMany(queryOptions);
    res.send(comments);
  })
);

// 중고마켓 댓글 등록
router.post(
  "/:id/comments",
  asyncHandler(async (req, res) => {
    assert(req.body, CreateComment);
    const { id } = req.params;

    const comment = await prisma.comment.create({
      data: {
        ...req.body,
        productId: id,
      },
    });
    res.status(201).send(comment);
  })
);

// 중고마켓 댓글 수정
router.patch(
  "/:id/comments/:commentId",
  asyncHandler(async (req, res) => {
    assert(req.body, PatchComment);
    const { commentId } = req.params;
    const comment = await prisma.comment.update({
      where: {
        id: commentId,
      },
      data: req.body,
    });

    res.send(comment);
  })
);

// 중고마켓 댓글 삭제
router.delete(
  "/:id/comments/:commentId",
  asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    await prisma.comment.delete({
      where: {
        id: commentId,
      },
    });

    res.sendStatus(204);
  })
);

export default router;
