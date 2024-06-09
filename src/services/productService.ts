import { Prisma, Product } from "@prisma/client";
import prisma from "../client";
import AppError from "../utils/errors";

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
}): Promise<(Product & { images: string[] })[]> => {
  const order: Prisma.ProductOrderByWithRelationInput =
    orderBy === "favorite" ? { favoriteCount: "desc" } : { createdAt: "desc" };

  const products = await prisma.product.findMany({
    orderBy: order,
    skip: offset,
    take: limit,
    select: {
      id: true,
      name: true,
      description: true,
      price: true,
      favoriteCount: true,
      createdAt: true,
      updatedAt: true,
      writer: true,
      tags: true,
      userId: true,
      images: {
        select: {
          imagePath: true,
        },
      },
    },
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

  return products.map((product) => ({
    ...product,
    images: product.images.map((image) => image.imagePath),
  }));
};

export const getBestProducts = async (): Promise<(Product & { images: string[] })[]> => {
  const bestProducts = await prisma.product.findMany({
    select: {
      id: true,
      name: true,
      description: true,
      price: true,
      favoriteCount: true,
      createdAt: true,
      updatedAt: true,
      writer: true,
      tags: true,
      userId: true,
      images: {
        select: {
          imagePath: true,
        },
      },
    },
    orderBy: {
      favoriteCount: "desc",
    },
    take: 4,
  });

  return bestProducts.map((product) => ({
    ...product,
    images: product.images.map((image) => image.imagePath),
  }));
};

export const getProductsCount = async (keyword: string): Promise<number> => {
  return await prisma.product.count({
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

export const createProduct = async (
  userId: number,
  productData: Omit<Prisma.ProductCreateInput, "user" | "writer" | "images">,
  imageUrl: string
): Promise<Product & { images: string[] }> => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { name: true },
  });

  if (!user) {
    throw new Error("유저 정보를 찾을 수 없습니다.");
  }

  const productDataWithWriterName = {
    ...productData,
    writer: user.name!,
    user: {
      connect: { id: userId },
    },
    images: {
      create: [{ imagePath: imageUrl }],
    },
  };

  const createdProduct = await prisma.product.create({
    data: productDataWithWriterName,
    include: {
      images: true,
    },
  });

  return {
    ...createdProduct,
    images: createdProduct.images.map((image) => image.imagePath),
  };
};

export const getProductById = async (id: string): Promise<(Product & { images: string[] }) | null> => {
  const product = await prisma.product.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      description: true,
      price: true,
      favoriteCount: true,
      createdAt: true,
      writer: true,
      images: {
        select: {
          imagePath: true,
        },
      },
      tags: true,
      updatedAt: true,
      userId: true,
    },
  });

  if (!product) {
    throw new AppError("존재하지 않는 상품입니다.", 404);
  }

  return {
    ...product,
    images: product.images.map((image) => image.imagePath),
  };
};

export const updateProduct = async (
  id: string,
  userId: number,
  productData: Prisma.ProductUpdateInput,
  imageUrl: string
): Promise<Product & { images: string[] }> => {
  const product = await prisma.product.findUniqueOrThrow({
    where: { id },
    include: { images: true },
  });

  if (product.userId !== userId) {
    throw new AppError("상품을 수정할 권한이 없습니다.", 403);
  }

  if (imageUrl) {
    const existingImage = product.images[0];
    if (existingImage) {
      await prisma.image.update({
        where: { id: existingImage.id },
        data: { imagePath: imageUrl },
      });
    } else {
      await prisma.image.create({
        data: {
          imagePath: imageUrl,
          product: { connect: { id } },
        },
      });
    }
  }

  const updatedProduct = await prisma.product.update({
    where: { id },
    data: productData,
    include: {
      images: true,
    },
  });

  return {
    ...updatedProduct,
    images: updatedProduct.images.map((image) => image.imagePath),
  };
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

export const likeProduct = async (productId: string, userId: number): Promise<Product & { images: string[] }> => {
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
      include: { images: true },
    }),
  ]);

  return {
    ...updatedProduct,
    images: updatedProduct.images.map((image) => image.imagePath),
  };
};

export const unlikeProduct = async (productId: string, userId: number): Promise<Product & { images: string[] }> => {
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
      include: { images: true },
    }),
  ]);

  return {
    ...updatedProduct,
    images: updatedProduct.images.map((image) => image.imagePath),
  };
};
