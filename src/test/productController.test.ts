import { describe, expect, jest, test } from "@jest/globals";
import { NextFunction, Request, Response } from "express";
import { assert } from "superstruct";
import * as productController from "../controllers/productController";
import * as productService from "../services/productService";
import { CreateProduct, PatchProduct } from "../structs";
import AppError from "../utils/errors";

const mockProducts = [
  {
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
    images: ["image1.jpg"],
  },
];

const mockBestProducts = [
  {
    id: "test-product-id",
    name: "베스트 상품",
    description: "이것은 베스트 상품입니다",
    price: 200,
    favoriteCount: 100,
    createdAt: new Date(),
    updatedAt: new Date(),
    writer: "베스트 유저",
    tags: [],
    userId: 1,
    images: ["bestimage1.jpg"],
  },
];

jest.mock("superstruct", () => {
  const originalModule = jest.requireActual<typeof import("superstruct")>("superstruct");
  return {
    ...originalModule,
    assert: jest.fn(),
  };
});

jest.mock("../services/productService");

const setup = () => {
  const req = {
    body: {},
    params: {},
    query: {},
    userId: 1,
  } as unknown as Request<{ id: string }> & { userId: number };

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
    send: jest.fn(),
    sendStatus: jest.fn(),
  } as unknown as Response;

  const next = jest.fn() as NextFunction;

  return { req, res, next };
};

describe("상품 컨트롤러", () => {
  describe("getProducts", () => {
    test("상품과 베스트 상품을 반환해야 한다", async () => {
      const { req, res, next } = setup();
      req.query = { offset: "0", limit: "10", orderBy: "recent", keyword: "" };

      (productService.getProducts as jest.MockedFunction<typeof productService.getProducts>).mockResolvedValue(
        mockProducts
      );
      (productService.getBestProducts as jest.MockedFunction<typeof productService.getBestProducts>).mockResolvedValue(
        mockBestProducts
      );

      await productController.getProducts(req, res, next);

      expect(res.send).toHaveBeenCalledWith({ products: mockProducts, bestProducts: mockBestProducts });
    });
  });

  describe("createProduct", () => {
    test("상품을 생성해야 한다", async () => {
      const { req, res, next } = setup();
      req.body = { name: "새로운 판다인형", price: 100, description: "새로운 상품입니다." };

      const mockProduct = {
        id: "test-product-id",
        name: "새로운 판다인형",
        description: "새로운 상품입니다.",
        price: 100,
        favoriteCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        writer: "테스트 유저",
        tags: [],
        userId: 1,
        images: ["image1.jpg"],
      };

      (productService.createProduct as jest.MockedFunction<typeof productService.createProduct>).mockResolvedValue(
        mockProduct
      );

      await productController.createProduct(req, res, next);

      expect(assert).toHaveBeenCalledWith(req.body, CreateProduct);
      expect(productService.createProduct).toHaveBeenCalledWith(req.userId, req.body, "");
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.send).toHaveBeenCalledWith(mockProduct);
    });
  });

  describe("getProductById", () => {
    test("ID로 상품을 반환해야 한다", async () => {
      const { req, res, next } = setup();
      req.params = { id: "1" };

      const mockProduct = {
        id: "test-product-id",
        name: "새로운 판다 1",
        description: "새로운 상품",
        price: 100,
        favoriteCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        writer: "테스트 유저",
        tags: [],
        userId: 1,
        images: ["image1.jpg"],
      };

      (productService.getProductById as jest.MockedFunction<typeof productService.getProductById>).mockResolvedValue(
        mockProduct
      );

      await productController.getProductById(req, res, next);

      expect(productService.getProductById).toHaveBeenCalledWith("1");
      expect(res.send).toHaveBeenCalledWith(mockProduct);
    });
  });

  describe("updateProduct", () => {
    test("상품을 업데이트해야 한다", async () => {
      const { req, res, next } = setup();
      req.params = { id: "1" };
      req.body = { name: "수정된 판다", price: 150 };

      const mockUpdatedProduct = {
        id: "test-product-id",
        name: "수정된 판다",
        description: "수정된 상품입니다.",
        price: 150,
        favoriteCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        writer: "테스트 유저",
        tags: [],
        userId: 1,
        images: ["image1.jpg"],
      };

      (productService.updateProduct as jest.MockedFunction<typeof productService.updateProduct>).mockResolvedValue(
        mockUpdatedProduct
      );

      await productController.updateProduct(req, res, next);

      expect(assert).toHaveBeenCalledWith(req.body, PatchProduct);
      expect(productService.updateProduct).toHaveBeenCalledWith("1", req.userId, req.body, "");
      expect(res.send).toHaveBeenCalledWith(mockUpdatedProduct);
    });

    test("상품 수정 시 권한이 없으면 예외를 발생시킨다", async () => {
      const { req, res, next } = setup();
      req.params = { id: "1" };
      req.body = { name: "Updated Product", price: 150 };

      (productService.updateProduct as jest.MockedFunction<typeof productService.updateProduct>).mockRejectedValue(
        new AppError("게시글을 수정할 권한이 없습니다.", 403)
      );

      await productController.updateProduct(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ message: "게시글을 수정할 권한이 없습니다." });
    });
  });

  describe("deleteProduct", () => {
    test("상품을 삭제해야 한다", async () => {
      const { req, res, next } = setup();
      req.params = { id: "1" };

      await productController.deleteProduct(req, res, next);

      expect(productService.deleteProduct).toHaveBeenCalledWith("1", req.userId);
      expect(res.sendStatus).toHaveBeenCalledWith(204);
    });

    test("상품 삭제 시 권한이 없으면 예외를 발생시킨다", async () => {
      const { req, res, next } = setup();
      req.params = { id: "1" };

      (productService.deleteProduct as jest.MockedFunction<typeof productService.deleteProduct>).mockRejectedValue(
        new AppError("게시글을 삭제할 권한이 없습니다.", 403)
      );

      await productController.deleteProduct(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ message: "게시글을 삭제할 권한이 없습니다." });
    });
  });

  describe("likeProduct", () => {
    test("상품에 좋아요를 눌러야 한다", async () => {
      const { req, res, next } = setup();
      req.params = { id: "1" };

      const mockUpdatedProduct = {
        id: "test-product-id",
        name: "상품 1",
        description: "상품입니다.",
        price: 100,
        favoriteCount: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
        writer: "테스트 유저",
        tags: [],
        userId: 1,
        images: ["image1.jpg"],
      };

      (productService.likeProduct as jest.MockedFunction<typeof productService.likeProduct>).mockResolvedValue(
        mockUpdatedProduct
      );

      await productController.likeProduct(req, res, next);

      expect(productService.likeProduct).toHaveBeenCalledWith("1", req.userId);
      expect(res.send).toHaveBeenCalledWith(mockUpdatedProduct);
    });

    test("이미 좋아요가 된 게시글에 좋아요를 누를 경우 에러를 반환한다", async () => {
      const { req, res, next } = setup();
      req.params = { id: "1" };

      (productService.likeProduct as jest.MockedFunction<typeof productService.likeProduct>).mockRejectedValue(
        new AppError("이미 좋아요 처리된 게시글입니다.", 409)
      );

      await productController.likeProduct(req, res, next);

      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.json).toHaveBeenCalledWith({ message: "이미 좋아요 처리된 게시글입니다." });
    });
  });

  describe("unlikeProduct", () => {
    test("상품의 좋아요를 취소해야 한다", async () => {
      const { req, res, next } = setup();
      req.params = { id: "1" };

      const mockUpdatedProduct = {
        id: "test-product-id",
        name: "판다 1",
        description: "상품입니다.",
        price: 100,
        favoriteCount: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
        writer: "테스트 유저",
        tags: [],
        userId: 1,
        images: ["image1.jpg"],
      };

      (productService.unlikeProduct as jest.MockedFunction<typeof productService.unlikeProduct>).mockResolvedValue(
        mockUpdatedProduct
      );

      await productController.unlikeProduct(req, res, next);

      expect(productService.unlikeProduct).toHaveBeenCalledWith("1", req.userId);
      expect(res.send).toHaveBeenCalledWith(mockUpdatedProduct);
    });

    test("아직 좋아요 처리되지 않은 상품의 좋아요를 취소하려고 할 경우 에러를 반환한다", async () => {
      const { req, res, next } = setup();
      req.params = { id: "1" };

      (productService.unlikeProduct as jest.MockedFunction<typeof productService.unlikeProduct>).mockRejectedValue(
        new AppError("아직 좋아요 처리되지 않은 게시글입니다.", 409)
      );

      await productController.unlikeProduct(req, res, next);

      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.json).toHaveBeenCalledWith({ message: "아직 좋아요 처리되지 않은 게시글입니다." });
    });
  });
});
