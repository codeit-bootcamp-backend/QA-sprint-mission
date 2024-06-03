import { describe, expect, jest, test } from "@jest/globals";
import prisma from "../client";
import {
  createProduct,
  deleteProduct,
  getBestProducts,
  getProductById,
  getProducts,
  likeProduct,
  unlikeProduct,
  updateProduct,
} from "../services/productService";
import AppError from "../utils/errors";

jest.mock("../client", () => ({
  __esModule: true,
  default: {
    product: {
      findMany: jest.fn(),
      create: jest.fn(),
      findUnique: jest.fn(),
      findUniqueOrThrow: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    user: {
      findUnique: jest.fn(),
    },
    image: {
      update: jest.fn(),
      create: jest.fn(),
    },
    favorite: {
      findUnique: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
    },
    $transaction: jest.fn(),
  },
}));

describe("상품 서비스", () => {
  const mockProduct = {
    id: "test-product-id",
    name: "테스트 상품",
    description: "이것은 테스트 상품입니다",
    price: 100,
    favoriteCount: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    writer: "테스트 유저",
    tags: [],
    userId: 1,
    images: [{ id: "image-id", imagePath: "image1.jpg" }],
  };

  const mockUser = {
    id: 1,
    googleId: null,
    email: "test@example.com",
    name: "테스트 유저",
    nickname: "testuser",
    image: null,
    password: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockFavorite = {
    id: "favorite-id",
    createdAt: new Date(),
    userId: 1,
    productId: "test-product-id",
    articleId: null,
  };

  const mockImage = {
    id: "image-id",
    imagePath: "image1.jpg",
    productId: "test-product-id",
    createdAt: new Date(),
    updatedAt: new Date(),
    articleId: null,
  };

  test("상품을 조회한다", async () => {
    const products = [mockProduct];
    (prisma.product.findMany as jest.MockedFunction<typeof prisma.product.findMany>).mockResolvedValue(products);

    const result = await getProducts({ offset: 0, limit: 10, orderBy: "recent", keyword: "" });
    expect(result).toEqual(products);
    expect(prisma.product.findMany).toHaveBeenCalledWith({
      orderBy: { createdAt: "desc" },
      skip: 0,
      take: 10,
      where: {
        OR: [{ name: { contains: "", mode: "insensitive" } }, { description: { contains: "", mode: "insensitive" } }],
      },
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
          select: { imagePath: true },
        },
      },
    });
  });

  test("베스트 상품을 조회한다", async () => {
    const products = [mockProduct];
    (prisma.product.findMany as jest.MockedFunction<typeof prisma.product.findMany>).mockResolvedValue(products);

    const result = await getBestProducts();
    expect(result).toEqual(products);
    expect(prisma.product.findMany).toHaveBeenCalledWith({
      orderBy: { favoriteCount: "desc" },
      take: 4,
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
          select: { imagePath: true },
        },
      },
    });
  });

  test("상품을 생성한다", async () => {
    (prisma.user.findUnique as jest.MockedFunction<typeof prisma.user.findUnique>).mockResolvedValue(mockUser);
    (prisma.product.create as jest.MockedFunction<typeof prisma.product.create>).mockResolvedValue(mockProduct);

    const result = await createProduct(
      1,
      {
        name: "테스트 상품",
        description: "이것은 테스트 상품입니다",
        price: 100,
      },
      "image1.jpg"
    );

    expect(result).toEqual(mockProduct);
    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { id: 1 },
      select: { name: true },
    });
    expect(prisma.product.create).toHaveBeenCalledWith({
      data: {
        name: "테스트 상품",
        description: "이것은 테스트 상품입니다",
        price: 100,
        writer: "테스트 유저",
        user: {
          connect: { id: 1 },
        },
        images: {
          create: [{ imagePath: "image1.jpg" }],
        },
      },
      include: { images: true },
    });
  });

  test("유저가 없을 때 상품을 생성하려고 하면 예외를 발생시킨다", async () => {
    (prisma.user.findUnique as jest.MockedFunction<typeof prisma.user.findUnique>).mockResolvedValue(null);
    await expect(
      createProduct(
        1,
        {
          name: "테스트 상품",
          description: "이것은 테스트 상품입니다",
          price: 100,
        },
        "image1.jpg"
      )
    ).rejects.toThrow("유저 정보를 찾을 수 없습니다.");
  });

  test("상품 아이디로 상품을 조회한다", async () => {
    (prisma.product.findUnique as jest.MockedFunction<typeof prisma.product.findUnique>).mockResolvedValue(mockProduct);

    const result = await getProductById("test-product-id");
    expect(result).toEqual(mockProduct);
    expect(prisma.product.findUnique).toHaveBeenCalledWith({
      where: { id: "test-product-id" },
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
  });

  test("존재하지 않는 상품을 조회하려고 하면 예외를 발생시킨다", async () => {
    (prisma.product.findUnique as jest.MockedFunction<typeof prisma.product.findUnique>).mockResolvedValue(null);
    await expect(getProductById("non-existent-product-id")).rejects.toThrow("존재하지 않는 상품입니다.");
  });

  test("상품을 업데이트한다", async () => {
    (
      prisma.product.findUniqueOrThrow as jest.MockedFunction<typeof prisma.product.findUniqueOrThrow>
    ).mockResolvedValue(mockProduct);
    (prisma.product.update as jest.MockedFunction<typeof prisma.product.update>).mockResolvedValue(mockProduct);
    (prisma.image.update as jest.MockedFunction<typeof prisma.image.update>).mockResolvedValue(mockImage);
    (prisma.image.create as jest.MockedFunction<typeof prisma.image.create>).mockResolvedValue(mockImage);

    const result = await updateProduct(
      "test-product-id",
      1,
      {
        name: "업데이트된 상품",
        description: "업데이트된 설명",
        price: 150,
      },
      "image1.jpg"
    );

    expect(result).toEqual(mockProduct);
    expect(prisma.product.findUniqueOrThrow).toHaveBeenCalledWith({
      where: { id: "test-product-id" },
      include: { images: true },
    });

    const existingImage = mockProduct.images[0];
    if (existingImage) {
      expect(prisma.image.update).toHaveBeenCalledWith({
        where: { id: existingImage.id },
        data: { imagePath: "image1.jpg" },
      });
    } else {
      expect(prisma.image.create).toHaveBeenCalledWith({
        data: {
          imagePath: "image1.jpg",
          product: { connect: { id: "test-product-id" } },
        },
      });
    }

    expect(prisma.product.update).toHaveBeenCalledWith({
      where: { id: "test-product-id" },
      data: {
        name: "업데이트된 상품",
        description: "업데이트된 설명",
        price: 150,
      },
      include: { images: true },
    });
  });

  test("이미지 URL이 없는 경우 상품을 업데이트한다", async () => {
    (
      prisma.product.findUniqueOrThrow as jest.MockedFunction<typeof prisma.product.findUniqueOrThrow>
    ).mockResolvedValue(mockProduct);
    (prisma.product.update as jest.MockedFunction<typeof prisma.product.update>).mockResolvedValue(mockProduct);

    const result = await updateProduct(
      "test-product-id",
      1,
      {
        name: "업데이트된 상품",
        description: "업데이트된 설명",
        price: 150,
      },
      ""
    );

    expect(result).toEqual(mockProduct);
    expect(prisma.product.findUniqueOrThrow).toHaveBeenCalledWith({
      where: { id: "test-product-id" },
      include: { images: true },
    });

    expect(prisma.image.update).not.toHaveBeenCalled();
    expect(prisma.image.create).not.toHaveBeenCalled();

    expect(prisma.product.update).toHaveBeenCalledWith({
      where: { id: "test-product-id" },
      data: {
        name: "업데이트된 상품",
        description: "업데이트된 설명",
        price: 150,
      },
      include: { images: true },
    });
  });

  test("존재하지 않는 상품을 업데이트하려고 하면 예외를 발생시킨다", async () => {
    (
      prisma.product.findUniqueOrThrow as jest.MockedFunction<typeof prisma.product.findUniqueOrThrow>
    ).mockRejectedValue(new AppError("존재하지 않는 상품입니다.", 404));

    await expect(
      updateProduct(
        "non-existent-product-id",
        1,
        {
          name: "업데이트된 상품",
          description: "업데이트된 설명",
          price: 150,
        },
        "image1.jpg"
      )
    ).rejects.toThrow("존재하지 않는 상품입니다.");
  });

  test("기존 이미지가 없는 경우 이미지를 생성한다", async () => {
    const mockProductWithoutImage = { ...mockProduct, images: [] };
    (
      prisma.product.findUniqueOrThrow as jest.MockedFunction<typeof prisma.product.findUniqueOrThrow>
    ).mockResolvedValue(mockProductWithoutImage);
    (prisma.product.update as jest.MockedFunction<typeof prisma.product.update>).mockResolvedValue(mockProduct);
    (prisma.image.create as jest.MockedFunction<typeof prisma.image.create>).mockResolvedValue(mockImage);

    const result = await updateProduct(
      "test-product-id",
      1,
      {
        name: "업데이트된 상품",
        description: "업데이트된 설명",
        price: 150,
      },
      "image1.jpg"
    );

    expect(result).toEqual(mockProduct);
    expect(prisma.product.findUniqueOrThrow).toHaveBeenCalledWith({
      where: { id: "test-product-id" },
      include: { images: true },
    });

    expect(prisma.image.update).not.toHaveBeenCalled();
    expect(prisma.image.create).toHaveBeenCalledWith({
      data: {
        imagePath: "image1.jpg",
        product: { connect: { id: "test-product-id" } },
      },
    });

    expect(prisma.product.update).toHaveBeenCalledWith({
      where: { id: "test-product-id" },
      data: {
        name: "업데이트된 상품",
        description: "업데이트된 설명",
        price: 150,
      },
      include: { images: true },
    });
  });

  test("상품을 삭제한다", async () => {
    (prisma.product.findUnique as jest.MockedFunction<typeof prisma.product.findUnique>).mockResolvedValueOnce(
      mockProduct
    );
    (prisma.product.delete as jest.MockedFunction<typeof prisma.product.delete>).mockResolvedValue(mockProduct);
    (prisma.product.findUnique as jest.MockedFunction<typeof prisma.product.findUnique>).mockResolvedValueOnce(null);

    await deleteProduct("test-product-id", 1);

    expect(prisma.product.findUnique).toHaveBeenCalledWith({
      where: { id: "test-product-id" },
    });

    expect(prisma.product.delete).toHaveBeenCalledWith({
      where: { id: "test-product-id" },
    });

    expect(prisma.product.findUnique).toHaveBeenCalledWith({
      where: { id: "test-product-id" },
    });

    expect(await prisma.product.findUnique({ where: { id: "test-product-id" } })).toBeNull();
  });

  test("존재하지 않는 상품을 삭제하려고 하면 예외를 발생시킨다", async () => {
    (prisma.product.findUnique as jest.MockedFunction<typeof prisma.product.findUnique>).mockResolvedValue(null);
    await expect(deleteProduct("non-existent-product-id", 1)).rejects.toThrow("존재하지 않는 상품입니다.");
  });

  test("상품을 삭제할 권한이 없으면 예외를 발생시킨다", async () => {
    const anotherUserProduct = { ...mockProduct, userId: 2 };
    (prisma.product.findUnique as jest.MockedFunction<typeof prisma.product.findUnique>).mockResolvedValue(
      anotherUserProduct
    );

    await expect(deleteProduct("test-product-id", 1)).rejects.toThrow("상품을 삭제할 권한이 없습니다.");
  });

  test("상품에 좋아요를 누른다", async () => {
    const updatedProduct = { ...mockProduct, favoriteCount: mockProduct.favoriteCount + 1 };
    (prisma.favorite.findUnique as jest.MockedFunction<typeof prisma.favorite.findUnique>).mockResolvedValue(null);
    (prisma.product.update as jest.MockedFunction<typeof prisma.product.update>).mockResolvedValue(updatedProduct);
    (prisma.$transaction as jest.MockedFunction<typeof prisma.$transaction>).mockResolvedValue([null, updatedProduct]);

    const result = await likeProduct("test-product-id", 1);
    expect(result).toEqual(updatedProduct);
    expect(result.favoriteCount).toBe(mockProduct.favoriteCount + 1);
    expect(prisma.favorite.findUnique).toHaveBeenCalledWith({
      where: {
        userId_productId: {
          userId: 1,
          productId: "test-product-id",
        },
      },
    });
    expect(prisma.$transaction).toHaveBeenCalled();
  });

  test("이미 좋아요가 된 상품에 좋아요를 누를 경우 에러를 반환한다", async () => {
    (prisma.favorite.findUnique as jest.MockedFunction<typeof prisma.favorite.findUnique>).mockResolvedValue(
      mockFavorite
    );

    await expect(likeProduct("test-product-id", 1)).rejects.toThrow("이미 좋아요 처리된 상품입니다.");
    expect(prisma.favorite.findUnique).toHaveBeenCalledWith({
      where: {
        userId_productId: {
          userId: 1,
          productId: "test-product-id",
        },
      },
    });
  });

  test("상품에 좋아요를 취소한다", async () => {
    const updatedProduct = { ...mockProduct, favoriteCount: mockProduct.favoriteCount - 1 };
    (prisma.favorite.findUnique as jest.MockedFunction<typeof prisma.favorite.findUnique>).mockResolvedValue(
      mockFavorite
    );
    (prisma.product.update as jest.MockedFunction<typeof prisma.product.update>).mockResolvedValue(updatedProduct);
    (prisma.$transaction as jest.MockedFunction<typeof prisma.$transaction>).mockResolvedValue([null, updatedProduct]);

    const result = await unlikeProduct("test-product-id", 1);
    expect(result).toEqual(updatedProduct);
    expect(result.favoriteCount).toBe(mockProduct.favoriteCount - 1);
    expect(prisma.favorite.findUnique).toHaveBeenCalledWith({
      where: {
        userId_productId: {
          userId: 1,
          productId: "test-product-id",
        },
      },
    });
    expect(prisma.$transaction).toHaveBeenCalled();
  });

  test("좋아요가 취소된 상품을 다시 취소하려고 할 경우 에러를 반환한다", async () => {
    (prisma.favorite.findUnique as jest.MockedFunction<typeof prisma.favorite.findUnique>).mockResolvedValue(null);

    await expect(unlikeProduct("test-product-id", 1)).rejects.toThrow("아직 좋아요 처리되지 않은 상품입니다.");
    expect(prisma.favorite.findUnique).toHaveBeenCalledWith({
      where: {
        userId_productId: {
          userId: 1,
          productId: "test-product-id",
        },
      },
    });
  });

  test("상품을 수정할 권한이 없으면 예외를 발생시킨다", async () => {
    const anotherUserProduct = { ...mockProduct, userId: 2 };
    (
      prisma.product.findUniqueOrThrow as jest.MockedFunction<typeof prisma.product.findUniqueOrThrow>
    ).mockResolvedValue(anotherUserProduct);

    await expect(
      updateProduct(
        "test-product-id",
        1,
        {
          name: "업데이트된 상품",
          description: "업데이트된 설명",
          price: 150,
        },
        "image1.jpg"
      )
    ).rejects.toThrow("상품을 수정할 권한이 없습니다.");
  });
});
