import { Comment, Prisma } from "@prisma/client";
import prisma from "../client";
import AppError from "../utils/errors";

export const getCommentsByProductId = async (productId: string, cursor?: string): Promise<Comment[]> => {
  const queryOptions: Prisma.CommentFindManyArgs = {
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
    cursor: cursor ? { id: cursor } : undefined,
    skip: cursor ? 1 : undefined,
  };

  return await prisma.comment.findMany(queryOptions);
};

export const getCommentsByArticleId = async (articleId: string, cursor?: string): Promise<Comment[]> => {
  const queryOptions: Prisma.CommentFindManyArgs = {
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
    cursor: cursor ? { id: cursor } : undefined,
    skip: cursor ? 1 : undefined,
  };

  return await prisma.comment.findMany(queryOptions);
};

export const createComment = async (commentData: {
  content: string;
  imageUrl?: string;
  userId: number;
  productId?: string;
  articleId?: string;
}): Promise<Comment> => {
  const user = await prisma.user.findUnique({
    where: { id: commentData.userId },
    select: { name: true },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const commentDataWithWriterName = {
    ...commentData,
    writer: user.name!,
  };

  return await prisma.comment.create({
    data: commentDataWithWriterName,
  });
};
export const updateComment = async (commentId: string, userId: number, content: string): Promise<Comment> => {
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

export const deleteComment = async (commentId: string, userId: number): Promise<void> => {
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
