import { PrismaClient } from "@prisma/client";
import express from "express";
import { assert } from "superstruct";
import authenticate from "../middlewares/authenticate.js";
import { CreateArticle, CreateComment, PatchArticle, PatchComment } from "../structs.js";
import asyncHandler from "../utils/asyncHandler.js";

const prisma = new PrismaClient();
const router = express.Router();

router
  .route("/")
  .get(
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
  )
  .post(
    authenticate,
    asyncHandler(async (req, res) => {
      assert(req.body, CreateArticle);
      const article = await prisma.article.create({
        data: req.body,
      });
      res.status(201).send(article);
    })
  );

router
  .route("/:id")
  .get(
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
  )
  .patch(
    authenticate,
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
  )
  .delete(
    authenticate,
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

router.patch(
  "/:id/like",
  authenticate,
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

router.patch(
  "/:id/unlike",
  authenticate,
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

router
  .route("/:id/comments")
  .get(
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
  )
  .post(
    authenticate,
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

router
  .route("/:id/comments/:commentId")
  .patch(
    authenticate,
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
  )
  .delete(
    authenticate,
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
