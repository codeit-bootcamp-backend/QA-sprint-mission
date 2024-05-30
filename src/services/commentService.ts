import { PrismaClient } from "@prisma/client";
import AppError from "../utils/errors.js";

const prisma = new PrismaClient();

export const getCommentsByProductId = async (productId, cursor) => {
  let queryOptions = {
    take: 10,
    orderBy: {
      createdAt: "desc",
    },
    where: {
      productId: productId,
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

  return await prisma.comment.findMany(queryOptions);
};

export const getCommentsByArticleId = async (articleId, cursor) => {
  let queryOptions = {
    take: 10,
    orderBy: {
      createdAt: "desc",
    },
    where: {
      articleId: articleId,
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

  return await prisma.comment.findMany(queryOptions);
};

export const createComment = async (commentData) => {
  return await prisma.comment.create({
    data: commentData,
  });
};

export const updateComment = async (commentId, userId, content) => {
  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
  });

  if (!comment) {
    throw new AppError("존재하지 않는 댓글입니다.", 404);
  }

  if (comment.userId !== userId) {
    throw new AppError("이 댓글을 수정할 권한이 없습니다.", 403);
  }

  return await prisma.comment.update({
    where: { id: commentId },
    data: { content },
  });
};

export const deleteComment = async (commentId, userId) => {
  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
  });

  if (!comment) {
    throw new AppError("존재하지 않는 댓글입니다.", 404);
  }

  if (comment.userId !== userId) {
    throw new AppError("이 댓글을 삭제할 권한이 없습니다.", 403);
  }
  await prisma.comment.delete({
    where: { id: commentId },
  });
};
