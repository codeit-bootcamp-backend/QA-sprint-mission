import { PrismaClient } from "@prisma/client";
import express from "express";
import { assert } from "superstruct";
import { CreateArticle, CreateComment, PatchArticle, PatchComment } from "../structs.js";
import asyncHandler from "../utils/asyncHandler.js";

const prisma = new PrismaClient();
const router = express.Router();
// 게시글 목록 조회
router.get(
  "/",
  asyncHandler(async (req, res) => {
    /**
     * 쿼리 파라미터
     * - offset : 가져올 데이터의 시작 지점
     * - limit : 한 번에 가져올 데이터의 개수
     * - orderBy : 정렬 기준 like, recent (기본값: recent)
     */
    const { offset = 0, limit = 10, orderBy = "recent", keyword = "" } = req.query;
    const order = orderBy === "like" ? { likeCount: "desc" } : { createdAt: "desc" };
    const articles = await prisma.article.findMany({
      select: {
        id: true,
        title: true,
        content: true,
        imageUrl: true,
        createdAt: true,
        writer: true,
      },
      orderBy: order,
      skip: parseInt(offset),
      take: parseInt(limit),
      where: {
        OR: [
          {
            title: {
              contains: keyword,
              mode: "insensitive",
            },
          },
          {
            content: {
              contains: keyword,
              mode: "insensitive",
            },
          },
        ],
      },
    });
    // 좋아요가 많은 상위 4개의 글 조회
    const bestArticles = await prisma.article.findMany({
      orderBy: {
        likeCount: "desc",
      },
      take: 4,
    });

    res.send({ articles, bestArticles });
  })
);

// 게시글 상세 조회
router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const article = await prisma.article.findUniqueOrThrow({
      where: {
        id,
      },
      select: {
        id: true,
        title: true,
        content: true,
        imageUrl: true,
        createdAt: true,
        likeCount: true,
        writer: true,
      },
    });
    res.send(article);
  })
);

// 게시글 등록
router.post(
  "/",
  asyncHandler(async (req, res) => {
    assert(req.body, CreateArticle);
    const article = await prisma.article.create({
      data: req.body,
    });
    res.status(201).send(article);
  })
);

// 게시글 수정
router.patch(
  "/:id",
  asyncHandler(async (req, res) => {
    assert(req.body, PatchArticle);
    const { id } = req.params;
    const article = await prisma.article.update({
      where: {
        id,
      },
      data: req.body,
    });

    res.send(article);
  })
);

// 게시글 삭제
router.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    await prisma.article.delete({
      where: {
        id,
      },
    });

    res.sendStatus(204);
  })
);

// 게시글 좋아요
router.patch(
  "/:id/like",
  asyncHandler(async (req, res) => {
    const article = await prisma.article.findUniqueOrThrow({
      where: {
        id: req.params.id,
      },
    });

    const favorite = await prisma.favorite.findUnique({
      where: {
        userId_productId_articleId: {
          userId: req.userId,
          articleId: req.params.id,
        },
      },
    });

    if (favorite) {
      res.status(400).send({ message: "이미 좋아요 처리된 게시글입니다." });
      return;
    }

    const updatedArticle = await prisma.article.update({
      where: {
        id: req.params.id,
      },
      data: {
        likeCount: {
          increment: 1,
        },
        isLiked: true,
      },
    });

    res.send(updatedArticle);
  })
);

// 게시글 좋아요 취소
router.patch(
  "/:id/unlike",
  asyncHandler(async (req, res) => {
    const article = await prisma.article.findUniqueOrThrow({
      where: {
        id: req.params.id,
      },
    });

    const favorite = await prisma.favorite.findUnique({
      where: {
        userId_productId_articleId: {
          userId: req.userId,
          articleId: req.params.id,
        },
      },
    });

    if (!favorite) {
      res.status(400).send({ message: "아직 좋아요 처리되지 않은 게시글입니다." });
      return;
    }

    const updatedArticle = await prisma.article.update({
      where: {
        id: req.params.id,
      },
      data: {
        likeCount: {
          decrement: 1,
        },
        isLiked: false,
      },
    });

    res.send(updatedArticle);
  })
);

// 자유게시판 댓글 목록 조회
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
        articleId: id,
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

// 자유게시판 댓글 등록
router.post(
  "/:id/comments",
  asyncHandler(async (req, res) => {
    assert(req.body, CreateComment);
    const { id } = req.params;

    const comment = await prisma.comment.create({
      data: {
        ...req.body,
        articleId: id,
      },
    });
    res.status(201).send(comment);
  })
);

// 자유게시판 댓글 수정
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
