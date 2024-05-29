import { PrismaClient } from "@prisma/client";
import AppError from "../utils/errors.js";
const prisma = new PrismaClient();

export const getProducts = async ({ offset, limit, orderBy, keyword }) => {
  const order = orderBy === "favorite" ? { favoriteCount: "desc" } : { createdAt: "desc" };
  return await prisma.product.findMany({
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
};

export const createProduct = async (productData) => {
  return await prisma.product.create({
    data: productData,
  });
};

export const getProductById = async (id) => {
  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product) {
    throw new AppError("존재하지 않는 상품입니다.", 404);
  }
  return product;
};

export const updateProduct = async (productId, userId, productData) => {
  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product) {
    throw new AppError("존재하지 않는 상품입니다.", 404);
  }

  if (product.userId !== userId) {
    throw new AppError("상품을 수정할 권한이 없습니다.", 403);
  }

  return await prisma.product.update({
    where: { id: productId },
    data: productData,
  });
};

export const deleteProduct = async (productId, userId) => {
  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product) {
    throw new AppError("존재하지 않는 상품입니다.", 404);
  }

  if (product.userId !== userId) {
    throw new AppError("상품을 삭제할 권한이 없습니다.", 403);
  }

  await prisma.product.delete({
    where: { id: productId },
  });
};

export const likeProduct = async (productId, userId) => {
  const favorite = await prisma.favorite.findUnique({
    where: {
      userId_productId: {
        userId,
        productId,
      },
    },
  });

  if (favorite) {
    throw AppError("이미 좋아요 처리된 상품입니다.", 409);
  }

  const [createdFavorite, updatedProduct] = await prisma.$transaction([
    prisma.favorite.create({
      data: {
        userId,
        productId,
      },
    }),
    prisma.product.update({
      where: {
        id: productId,
      },
      data: {
        favoriteCount: {
          increment: 1,
        },
      },
    }),
  ]);

  return updatedProduct;
};

export const unlikeProduct = async (productId, userId) => {
  const favorite = await prisma.favorite.findUnique({
    where: {
      userId_productId: {
        userId,
        productId,
      },
    },
  });

  if (!favorite) {
    throw AppError("아직 좋아요 처리되지 않은 상품입니다.", 409);
  }

  const [deletedFavorite, updatedProduct] = await prisma.$transaction([
    prisma.favorite.delete({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    }),
    prisma.product.update({
      where: {
        id: productId,
      },
      data: {
        favoriteCount: {
          decrement: 1,
        },
      },
    }),
  ]);

  return updatedProduct;
};
