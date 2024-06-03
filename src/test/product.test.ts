import { describe, expect, jest, test } from "@jest/globals";
import prisma from "../client";
import { createProduct } from "../services/productService";

jest.mock("../client", () => ({
  __esModule: true,
  default: {
    user: {
      findUnique: jest.fn(),
    },
    product: {
      create: jest.fn(),
    },
  },
}));

describe("중고마켓", () => {
  test("새 상품을 등록한다", async () => {
    const userId = 1;
    const productData = {
      name: "판다인형 테스트",
      description: "테스트용 판다인형입니다.",
      price: 20000,
    };
    const imageUrl = "image1.jpg";

    const mockUser = {
      id: 1,
      googleId: null,
      email: "test@example.com",
      name: "테스트",
      nickname: "테스트의왕",
      image: null,
      password: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const mockProduct = {
      id: "test-product-id",
      ...productData,
      writer: mockUser.name,
      userId: userId,
      tags: [],
      favoriteCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      images: [{ imagePath: imageUrl }],
    };

    (prisma.user.findUnique as jest.MockedFunction<typeof prisma.user.findUnique>).mockResolvedValue(mockUser);
    (prisma.product.create as jest.MockedFunction<typeof prisma.product.create>).mockResolvedValue(mockProduct);

    const result = await createProduct(userId, productData, imageUrl);

    expect(result).toEqual(mockProduct);

    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { id: userId },
      select: { name: true },
    });
    expect(prisma.product.create).toHaveBeenCalledWith({
      data: {
        ...productData,
        writer: mockUser.name,
        user: {
          connect: { id: userId },
        },
        images: {
          create: [{ imagePath: imageUrl }],
        },
      },
      include: {
        images: true,
      },
    });
  });
});
