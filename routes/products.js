import { PrismaClient } from "@prisma/client";
import express from "express";
import { assert } from "superstruct";
import authenticate from "../middlewares/authenticate.js";
import { CreateComment, CreateProduct, PatchComment, PatchProduct } from "../structs.js";
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
  )
  .post(
    authenticate,
    asyncHandler(async (req, res) => {
      assert(req.body, CreateProduct);
      const { userId } = req;
      const product = await prisma.product.create({
        data: { ...req.body, userId },
      });
      res.status(201).send(product);
    })
  );

router
  .route("/:id")
  .get(
    asyncHandler(async (req, res) => {
      const { id } = req.params;
      const product = await prisma.product.findUniqueOrThrow({
        where: {
          id,
        },
      });
      res.send(product);
    })
  )
  .patch(
    authenticate,
    asyncHandler(async (req, res) => {
      assert(req.body, PatchProduct);

      const { id: productId } = req.params;
      const { userId } = req;

      const product = await prisma.product.findUniqueOrThrow({
        where: { id: productId },
      });

      if (product.userId !== userId) {
        return res.status(403).json({ error: "상품을 수정할 권한이 없습니다." });
      }

      const updatedProduct = await prisma.product.update({
        where: {
          id: productId,
        },
        data: req.body,
      });

      res.send(updatedProduct);
    })
  )
  .delete(
    authenticate,
    asyncHandler(async (req, res) => {
      const { id: productId } = req.params;
      const { userId } = req;

      const product = await prisma.product.findUniqueOrThrow({
        where: { id: productId },
      });

      if (product.userId !== userId) {
        return res.status(403).json({ error: "상품을 삭제할 권한이 없습니다." });
      }
      await prisma.product.delete({
        where: {
          id: productId,
        },
      });

      res.sendStatus(204);
    })
  );

router.patch(
  "/:id/like",
  authenticate,
  asyncHandler(async (req, res) => {
    const { id: productId } = req.params;
    const { userId } = req;

    const favorite = await prisma.favorite.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });

    if (favorite) {
      res.status(400).send({ message: "이미 좋아요 처리된 상품입니다." });
      return;
    }

    await prisma.favorite.create({
      data: {
        userId,
        productId,
      },
    });

    const updatedProduct = await prisma.product.update({
      where: {
        id: productId,
      },
      data: {
        favoriteCount: {
          increment: 1,
        },
      },
    });

    res.send(updatedProduct);
  })
);

router.patch(
  "/:id/unlike",
  authenticate,
  asyncHandler(async (req, res) => {
    const { id: productId } = req.params;
    const { userId } = req;

    const favorite = await prisma.favorite.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });

    if (!favorite) {
      return res.status(400).send({ message: "아직 좋아요 처리되지 않은 상품입니다." });
    }

    await prisma.favorite.delete({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });

    const updatedProduct = await prisma.product.update({
      where: {
        id: productId,
      },
      data: {
        favoriteCount: {
          decrement: 1,
        },
      },
    });

    res.send(updatedProduct);
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
  )
  .post(
    authenticate,
    asyncHandler(async (req, res) => {
      assert(req.body, CreateComment);

      const { userId } = req;
      const { id: productId } = req.params;

      const comment = await prisma.comment.create({
        data: {
          ...req.body,
          productId,
          userId,
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

      const { userId } = req;
      const { content } = req.body;
      const { commentId } = req.params;

      const comment = await prisma.comment.findUniqueOrThrow({
        where: { id: commentId },
      });

      if (comment.userId !== userId) {
        return res.status(403).json({ error: "이 댓글을 수정할 권한이 없습니다." });
      }

      const updatedComment = await prisma.comment.update({
        where: { id: commentId },
        data: { content },
      });
      res.send(updatedComment);
    })
  )
  .delete(
    authenticate,
    asyncHandler(async (req, res) => {
      const { commentId } = req.params;
      const { userId } = req;

      const comment = await prisma.comment.findUniqueOrThrow({
        where: { id: commentId },
      });

      if (comment.userId !== userId) {
        return res.status(403).json({ error: "이 댓글을 삭제할 권한이 없습니다." });
      }

      await prisma.comment.delete({
        where: { id: commentId },
      });

      res.sendStatus(204);
    })
  );

export default router;
