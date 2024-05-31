import { Prisma, PrismaClient, Product } from "@prisma/client";
import AppError from "../utils/errors";

const prisma = new PrismaClient();

export const getProducts = async ({
  offset,
  limit,
  orderBy,
  keyword,
}: {
  offset: number;
  limit: number;
  orderBy: string;
  keyword: string;
}): Promise<Product[]> => {
  const order: Prisma.ProductOrderByWithRelationInput =
    orderBy === "favorite" ? { favoriteCount: "desc" } : { createdAt: "desc" };

  return await prisma.product.findMany({
    orderBy: order,
    skip: offset,
    take: limit,
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

export const createProduct = async (productData: Prisma.ProductCreateInput): Promise<Product> => {
  return await prisma.product.create({
    data: productData,
  });
};

export const getProductById = async (id: string): Promise<Product | null> => {
  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product) {
    throw new AppError("존재하지 않는 상품입니다.", 404);
  }
  return product;
};

export const updateProduct = async (
  productId: string,
  userId: number,
  productData: Prisma.ProductUpdateInput
): Promise<Product> => {
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

export const deleteProduct = async (productId: string, userId: number): Promise<void> => {
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

export const likeProduct = async (productId: string, userId: number): Promise<Product> => {
  const favorite = await prisma.favorite.findUnique({
    where: {
      userId_productId: {
        userId,
        productId,
      },
    },
  });

  if (favorite) {
    throw new AppError("이미 좋아요 처리된 상품입니다.", 409);
  }

  const [, updatedProduct] = await prisma.$transaction([
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

export const unlikeProduct = async (productId: string, userId: number): Promise<Product> => {
  const favorite = await prisma.favorite.findUnique({
    where: {
      userId_productId: {
        userId,
        productId,
      },
    },
  });

  if (!favorite) {
    throw new AppError("아직 좋아요 처리되지 않은 상품입니다.", 409);
  }

  const [, updatedProduct] = await prisma.$transaction([
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
