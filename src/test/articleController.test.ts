import { afterEach, describe, expect, jest, test } from "@jest/globals";
import { NextFunction, Request, Response } from "express";
import * as articleController from "../controllers/articleController";
import * as articleService from "../services/articleService";
import AppError from "../utils/errors";

jest.mock("../services/articleService");

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

const mockArticle = {
  id: "test-article-id",
  title: "새로운 게시글",
  content: "새로운 게시글 내용",
  createdAt: new Date(),
  updatedAt: new Date(),
  likeCount: 0,
  writer: "김판다",
  userId: 1,
  images: [
    {
      id: "image-id",
      imagePath: "image1.jpg",
      articleId: "test-article-id",
      createdAt: new Date(),
      updatedAt: new Date(),
      productId: null,
    },
  ],
};

describe("게시글 컨트롤러", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getArticles", () => {
    test("게시글과 베스트 게시글을 반환한다", async () => {
      const { req, res, next } = setup();
      req.query = { offset: "0", limit: "10", orderBy: "recent", keyword: "" };

      const mockArticles = [mockArticle];
      const mockBestArticles = [mockArticle];

      (articleService.getArticles as jest.MockedFunction<typeof articleService.getArticles>).mockResolvedValue(
        mockArticles
      );
      (articleService.getBestArticles as jest.MockedFunction<typeof articleService.getBestArticles>).mockResolvedValue(
        mockBestArticles
      );

      await articleController.getArticles(req, res, next);

      expect(res.send).toHaveBeenCalledWith({ articles: mockArticles, bestArticles: mockBestArticles });
      expect(articleService.getArticles).toHaveBeenCalledWith({ offset: 0, limit: 10, orderBy: "recent", keyword: "" });
      expect(articleService.getBestArticles).toHaveBeenCalled();
    });

    test("쿼리 파라미터가 없는 경우 기본값으로 동작한다", async () => {
      const { req, res, next } = setup();
      await articleController.getArticles(req, res, next);
      expect(articleService.getArticles).toHaveBeenCalledWith({ offset: 0, limit: 10, orderBy: "recent", keyword: "" });
    });
  });

  describe("createArticle", () => {
    test("게시글을 생성한다", async () => {
      const { req, res, next } = setup();
      req.body = { title: "새로운 게시글", content: "새로운 게시글 내용", imageUrl: "image1.jpg" };

      (articleService.createArticle as jest.MockedFunction<typeof articleService.createArticle>).mockResolvedValue(
        mockArticle
      );

      await articleController.createArticle(req, res, next);

      expect(articleService.createArticle).toHaveBeenCalledWith(
        req.userId,
        { title: "새로운 게시글", content: "새로운 게시글 내용" },
        "image1.jpg"
      );
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.send).toHaveBeenCalledWith(mockArticle);
    });
  });

  describe("getArticleById", () => {
    test("ID로 게시글을 반환한다", async () => {
      const { req, res, next } = setup();
      req.params = { id: "1" };

      (articleService.getArticleById as jest.MockedFunction<typeof articleService.getArticleById>).mockResolvedValue(
        mockArticle
      );

      await articleController.getArticleById(req, res, next);

      expect(articleService.getArticleById).toHaveBeenCalledWith("1");
      expect(res.send).toHaveBeenCalledWith(mockArticle);
    });

    test("존재하지 않는 게시글을 조회하려고 하면 예외를 발생시킨다", async () => {
      const { req, res, next } = setup();
      req.params = { id: "non-existent-id" };

      (articleService.getArticleById as jest.MockedFunction<typeof articleService.getArticleById>).mockRejectedValue(
        new AppError("존재하지 않는 게시글입니다.", 404)
      );

      await articleController.getArticleById(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "존재하지 않는 게시글입니다." });
    });
  });

  describe("updateArticle", () => {
    test("게시글을 업데이트한다", async () => {
      const { req, res, next } = setup();
      req.params = { id: "1" };
      req.body = { title: "수정된 게시글", content: "수정된 게시글 내용", imageUrl: "image1.jpg" };

      const mockUpdatedArticle = { ...mockArticle, title: "수정된 게시글" };

      (articleService.updateArticle as jest.MockedFunction<typeof articleService.updateArticle>).mockResolvedValue(
        mockUpdatedArticle
      );

      await articleController.updateArticle(req, res, next);

      expect(articleService.updateArticle).toHaveBeenCalledWith(
        "1",
        req.userId,
        { title: "수정된 게시글", content: "수정된 게시글 내용" },
        "image1.jpg"
      );
      expect(res.send).toHaveBeenCalledWith(mockUpdatedArticle);
    });

    test("게시글 수정 시 권한이 없으면 예외를 발생시킨다", async () => {
      const { req, res, next } = setup();
      req.params = { id: "1" };
      req.body = { title: "수정된 게시글", content: "수정된 게시글 내용", imageUrl: "image1.jpg" };

      (articleService.updateArticle as jest.MockedFunction<typeof articleService.updateArticle>).mockRejectedValue(
        new AppError("게시글을 수정할 권한이 없습니다.", 403)
      );

      await articleController.updateArticle(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ message: "게시글을 수정할 권한이 없습니다." });
    });
  });

  describe("deleteArticle", () => {
    test("게시글을 삭제한다", async () => {
      const { req, res, next } = setup();
      req.params = { id: "1" };

      await articleController.deleteArticle(req, res, next);

      expect(articleService.deleteArticle).toHaveBeenCalledWith("1", req.userId);
      expect(res.sendStatus).toHaveBeenCalledWith(204);
    });

    test("게시글 삭제 시 권한이 없으면 예외를 발생시킨다", async () => {
      const { req, res, next } = setup();
      req.params = { id: "1" };

      (articleService.deleteArticle as jest.MockedFunction<typeof articleService.deleteArticle>).mockRejectedValue(
        new AppError("게시글을 삭제할 권한이 없습니다.", 403)
      );

      await articleController.deleteArticle(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ message: "게시글을 삭제할 권한이 없습니다." });
    });
  });

  describe("likeArticle", () => {
    test("게시글에 좋아요를 누른다", async () => {
      const { req, res, next } = setup();
      req.params = { id: "1" };

      const mockUpdatedArticle = { ...mockArticle, likeCount: 1 };

      (articleService.likeArticle as jest.MockedFunction<typeof articleService.likeArticle>).mockResolvedValue(
        mockUpdatedArticle
      );

      await articleController.likeArticle(req, res, next);

      expect(articleService.likeArticle).toHaveBeenCalledWith("1", req.userId);
      expect(res.send).toHaveBeenCalledWith(mockUpdatedArticle);
    });

    test("이미 좋아요가 된 게시글에 좋아요를 누를 경우 에러를 반환한다", async () => {
      const { req, res, next } = setup();
      req.params = { id: "1" };

      (articleService.likeArticle as jest.MockedFunction<typeof articleService.likeArticle>).mockRejectedValue(
        new AppError("이미 좋아요 처리된 게시글입니다.", 409)
      );

      await articleController.likeArticle(req, res, next);

      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.json).toHaveBeenCalledWith({ message: "이미 좋아요 처리된 게시글입니다." });
    });
  });

  describe("unlikeArticle", () => {
    test("게시글에 좋아요를 취소한다", async () => {
      const { req, res, next } = setup();
      req.params = { id: "1" };

      const mockUpdatedArticle = { ...mockArticle, likeCount: 0 };

      (articleService.unlikeArticle as jest.MockedFunction<typeof articleService.unlikeArticle>).mockResolvedValue(
        mockUpdatedArticle
      );

      await articleController.unlikeArticle(req, res, next);

      expect(articleService.unlikeArticle).toHaveBeenCalledWith("1", req.userId);
      expect(res.send).toHaveBeenCalledWith(mockUpdatedArticle);
    });

    test("아직 좋아요 처리되지 않은 게시글의 좋아요를 취소하려고 할 경우 에러를 반환한다", async () => {
      const { req, res, next } = setup();
      req.params = { id: "1" };

      (articleService.unlikeArticle as jest.MockedFunction<typeof articleService.unlikeArticle>).mockRejectedValue(
        new AppError("아직 좋아요 처리되지 않은 게시글입니다.", 409)
      );

      await articleController.unlikeArticle(req, res, next);

      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.json).toHaveBeenCalledWith({ message: "아직 좋아요 처리되지 않은 게시글입니다." });
    });
  });
});
