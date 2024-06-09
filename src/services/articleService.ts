import { Prisma } from "@prisma/client";
import prisma from "../client";
import AppError from "../utils/errors";

export const getArticles = async ({
  offset,
  limit,
  orderBy,
  keyword,
}: {
  offset: number;
  limit: number;
  orderBy: string;
  keyword: string;
}) => {
  const order: Prisma.ArticleOrderByWithRelationInput =
    orderBy === "like" ? { likeCount: "desc" } : { createdAt: "desc" };

  const articles = await prisma.article.findMany({
    select: {
      id: true,
      title: true,
      content: true,
      createdAt: true,
      writer: true,
      images: {
        select: {
          imagePath: true,
        },
      },
      likeCount: true,
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

  return articles.map((article) => ({
    ...article,
    images: article.images.map((image) => image.imagePath),
  }));
};

export const getBestArticles = async () => {
  const bestArticles = await prisma.article.findMany({
    select: {
      id: true,
      title: true,
      content: true,
      createdAt: true,
      writer: true,
      images: {
        select: {
          imagePath: true,
        },
      },
    },
    orderBy: {
      likeCount: "desc",
    },
    take: 4,
  });

  return bestArticles.map((article) => ({
    ...article,
    images: article.images.map((image) => image.imagePath),
  }));
};

export const getArticlesCount = async (keyword: string): Promise<number> => {
  return await prisma.article.count({
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
};

export const createArticle = async (
  userId: number,
  articleData: Omit<Prisma.ArticleCreateInput, "user" | "writer" | "images">,
  imageUrl: string
) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { name: true },
  });

  if (!user) {
    throw new Error("유저 정보를 찾을 수 없습니다.");
  }

  const articleDataWithWriterName: Prisma.ArticleCreateInput = {
    ...articleData,
    writer: user.name!,
    user: {
      connect: { id: userId },
    },
    images: {
      create: [{ imagePath: imageUrl }],
    },
  };

  const createdArticle = await prisma.article.create({
    data: articleDataWithWriterName,
    include: {
      images: true,
    },
  });

  return {
    ...createdArticle,
    images: createdArticle.images.map((image) => image.imagePath),
  };
};

export const getArticleById = async (id: string) => {
  const article = await prisma.article.findUniqueOrThrow({
    where: { id },
    select: {
      id: true,
      title: true,
      content: true,
      createdAt: true,
      likeCount: true,
      writer: true,
      images: {
        select: {
          imagePath: true,
        },
      },
    },
  });

  return {
    ...article,
    images: article.images.map((image) => image.imagePath),
  };
};

export const updateArticle = async (
  id: string,
  userId: number,
  articleData: Prisma.ArticleUpdateInput,
  imageUrl: string
) => {
  const article = await prisma.article.findUniqueOrThrow({
    where: { id },
    include: { images: true },
  });

  if (article.userId !== userId) {
    throw new AppError("게시글을 수정할 권한이 없습니다.", 403);
  }

  if (imageUrl) {
    const existingImage = article.images[0];
    if (existingImage) {
      await prisma.image.update({
        where: { id: existingImage.id },
        data: { imagePath: imageUrl },
      });
    } else {
      await prisma.image.create({
        data: {
          imagePath: imageUrl,
          article: { connect: { id } },
        },
      });
    }
  }

  const updatedArticle = await prisma.article.update({
    where: { id },
    data: articleData,
    include: {
      images: true,
    },
  });

  return {
    ...updatedArticle,
    images: updatedArticle.images.map((image) => image.imagePath),
  };
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

  const [, updatedArticle] = await prisma.$transaction([
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
      include: {
        images: {
          select: {
            imagePath: true,
          },
        },
      },
    }),
  ]);

  return {
    ...updatedArticle,
    images: updatedArticle.images.map((image) => image.imagePath),
  };
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

  const [, updatedArticle] = await prisma.$transaction([
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
      include: {
        images: {
          select: {
            imagePath: true,
          },
        },
      },
    }),
  ]);

  return {
    ...updatedArticle,
    images: updatedArticle.images.map((image) => image.imagePath),
  };
};
