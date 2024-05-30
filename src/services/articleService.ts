import { Prisma, PrismaClient } from "@prisma/client";
import AppError from "../utils/errors";

const prisma = new PrismaClient();

interface getArticlesParams {
  offset: number;
  limit: number;
  orderBy: string;
  keyword: string;
}

interface Article {
  title: string;
  content: string;
  imageUrl?: string;
  userId: number;
  writer?: string;
}

export const getArticles = async ({ offset, limit, orderBy, keyword }: getArticlesParams) => {
  const order: Prisma.ArticleOrderByWithRelationInput =
    orderBy === "like" ? { likeCount: "desc" } : { createdAt: "desc" };

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
    skip: offset,
    take: limit,
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

  return articles;
};

export const getBestArticles = async () => {
  const bestArticles = await prisma.article.findMany({
    orderBy: {
      likeCount: "desc",
    },
    take: 4,
  });

  return bestArticles;
};

export const createArticle = async (articleData: Article) => {
  return await prisma.article.create({
    data: articleData,
  });
};

export const getArticleById = async (id: string) => {
  return await prisma.article.findUniqueOrThrow({
    where: { id },
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
};

export const updateArticle = async (articleId: string, userId: number, articleData: Partial<Article>) => {
  const article = await prisma.article.findUniqueOrThrow({
    where: { id: articleId },
  });

  if (article.userId !== userId) {
    throw new AppError("게시글을 수정할 권한이 없습니다.", 403);
  }

  return await prisma.article.update({
    where: { id: articleId },
    data: {
      ...articleData,
      userId,
    },
  });
};

export const deleteArticle = async (articleId: string, userId: number) => {
  const article = await prisma.article.findUniqueOrThrow({
    where: { id: articleId },
  });

  if (article.userId !== userId) {
    throw new AppError("게시글을 삭제할 권한이 없습니다.", 403);
  }

  await prisma.article.delete({
    where: { id: articleId },
  });
};

export const likeArticle = async (articleId: string, userId: number) => {
  const favorite = await prisma.favorite.findUnique({
    where: {
      userId_articleId: {
        userId,
        articleId,
      },
    },
  });

  if (favorite) {
    throw new AppError("이미 좋아요 처리된 게시글입니다.", 409);
  }

  const [createdFavorite, updatedArticle] = await prisma.$transaction([
    prisma.favorite.create({
      data: {
        userId,
        articleId,
      },
    }),
    prisma.article.update({
      where: {
        id: articleId,
      },
      data: {
        likeCount: {
          increment: 1,
        },
      },
    }),
  ]);

  return updatedArticle;
};

export const unlikeArticle = async (articleId: string, userId: number) => {
  const favorite = await prisma.favorite.findUnique({
    where: {
      userId_articleId: {
        userId,
        articleId,
      },
    },
  });

  if (!favorite) {
    throw new AppError("아직 좋아요 처리되지 않은 게시글입니다.", 409);
  }

  const [deletedFavorite, updatedArticle] = await prisma.$transaction([
    prisma.favorite.delete({
      where: {
        userId_articleId: {
          userId,
          articleId,
        },
      },
    }),
    prisma.article.update({
      where: {
        id: articleId,
      },
      data: {
        likeCount: {
          decrement: 1,
        },
      },
    }),
  ]);

  return updatedArticle;
};
