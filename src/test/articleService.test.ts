import { describe, expect, jest, test } from "@jest/globals";
import prisma from "../client";
import {
  createArticle,
  deleteArticle,
  getArticleById,
  getArticles,
  getBestArticles,
  likeArticle,
  unlikeArticle,
  updateArticle,
} from "../services/articleService";
import AppError from "../utils/errors";

jest.mock("../client", () => ({
  __esModule: true,
  default: {
    article: {
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
  productId: null,
  articleId: "test-article-id",
};

describe("게시글 서비스", () => {
  describe("게시글을 조회한다", () => {
    test("게시글을 조회한다", async () => {
      const articles = [mockArticle];
      (prisma.article.findMany as jest.MockedFunction<typeof prisma.article.findMany>).mockResolvedValue(articles);

      const result = await getArticles({ offset: 0, limit: 10, orderBy: "recent", keyword: "" });
      expect(result).toEqual(articles);
      expect(prisma.article.findMany).toHaveBeenCalledWith({
        orderBy: { createdAt: "desc" },
        skip: 0,
        take: 10,
        where: {
          OR: [{ title: { contains: "", mode: "insensitive" } }, { content: { contains: "", mode: "insensitive" } }],
        },
        select: {
          id: true,
          title: true,
          content: true,
          createdAt: true,
          writer: true,
          images: {
            select: { imagePath: true },
          },
        },
      });
    });

    test("베스트 게시글을 조회한다", async () => {
      const articles = [mockArticle];
      (prisma.article.findMany as jest.MockedFunction<typeof prisma.article.findMany>).mockResolvedValue(articles);

      const result = await getBestArticles();
      expect(result).toEqual(articles);
      expect(prisma.article.findMany).toHaveBeenCalledWith({
        orderBy: { likeCount: "desc" },
        take: 4,
        select: {
          id: true,
          title: true,
          content: true,
          createdAt: true,
          writer: true,
          images: {
            select: { imagePath: true },
          },
        },
      });
    });
  });

  describe("게시글을 생성한다", () => {
    test("게시글을 생성한다", async () => {
      (prisma.user.findUnique as jest.MockedFunction<typeof prisma.user.findUnique>).mockResolvedValue(mockUser);
      (prisma.article.create as jest.MockedFunction<typeof prisma.article.create>).mockResolvedValue(mockArticle);

      const result = await createArticle(1, { title: "새로운 게시글", content: "새로운 게시글 내용" }, "image1.jpg");

      expect(result).toEqual(mockArticle);
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        select: { name: true },
      });
      expect(prisma.article.create).toHaveBeenCalledWith({
        data: {
          title: "새로운 게시글",
          content: "새로운 게시글 내용",
          writer: "테스트 유저",
          user: { connect: { id: 1 } },
          images: { create: [{ imagePath: "image1.jpg" }] },
        },
        include: { images: true },
      });
    });

    test("유저가 없을 때 게시글을 생성하려고 하면 예외를 발생시킨다", async () => {
      (prisma.user.findUnique as jest.MockedFunction<typeof prisma.user.findUnique>).mockResolvedValue(null);
      await expect(
        createArticle(1, { title: "새로운 게시글", content: "새로운 게시글 내용" }, "image1.jpg")
      ).rejects.toThrow("유저 정보를 찾을 수 없습니다.");
    });
  });

  describe("게시글 ID로 게시글을 조회한다", () => {
    test("게시글 ID로 게시글을 조회한다", async () => {
      (
        prisma.article.findUniqueOrThrow as jest.MockedFunction<typeof prisma.article.findUniqueOrThrow>
      ).mockResolvedValue(mockArticle);

      const result = await getArticleById("test-article-id");
      expect(result).toEqual(mockArticle);
      expect(prisma.article.findUniqueOrThrow).toHaveBeenCalledWith({
        where: { id: "test-article-id" },
        select: {
          id: true,
          title: true,
          content: true,
          createdAt: true,
          likeCount: true,
          writer: true,
          images: {
            select: { imagePath: true },
          },
        },
      });
    });

    test("존재하지 않는 게시글을 조회하려고 하면 예외를 발생시킨다", async () => {
      const error = new Error("No Article found");
      (
        prisma.article.findUniqueOrThrow as jest.MockedFunction<typeof prisma.article.findUniqueOrThrow>
      ).mockRejectedValue(error);

      await expect(getArticleById("non-existent-article-id")).rejects.toThrow("No Article found");
    });
  });

  describe("게시글을 수정한다", () => {
    test("게시글을 수정할 권한이 없으면 예외를 발생시킨다", async () => {
      const anotherUserArticle = { ...mockArticle, userId: 2 };
      (
        prisma.article.findUniqueOrThrow as jest.MockedFunction<typeof prisma.article.findUniqueOrThrow>
      ).mockResolvedValue(anotherUserArticle);

      await expect(
        updateArticle("test-article-id", 1, { title: "수정된 게시글", content: "수정된 게시글 내용" }, "image1.jpg")
      ).rejects.toThrow("게시글을 수정할 권한이 없습니다.");
    });

    test("게시글을 수정한다", async () => {
      (
        prisma.article.findUniqueOrThrow as jest.MockedFunction<typeof prisma.article.findUniqueOrThrow>
      ).mockResolvedValue(mockArticle);
      (prisma.article.update as jest.MockedFunction<typeof prisma.article.update>).mockResolvedValue(mockArticle);
      (prisma.image.update as jest.MockedFunction<typeof prisma.image.update>).mockResolvedValue(mockArticle.images[0]);
      (prisma.image.create as jest.MockedFunction<typeof prisma.image.create>).mockResolvedValue(mockArticle.images[0]);

      const result = await updateArticle(
        "test-article-id",
        1,
        { title: "수정된 게시글", content: "수정된 게시글 내용" },
        "image1.jpg"
      );

      expect(result).toEqual(mockArticle);
      expect(prisma.article.findUniqueOrThrow).toHaveBeenCalledWith({
        where: { id: "test-article-id" },
        include: { images: true },
      });

      const existingImage = mockArticle.images[0];
      if (existingImage) {
        expect(prisma.image.update).toHaveBeenCalledWith({
          where: { id: existingImage.id },
          data: { imagePath: "image1.jpg" },
        });
      } else {
        expect(prisma.image.create).toHaveBeenCalledWith({
          data: {
            imagePath: "image1.jpg",
            article: { connect: { id: "test-article-id" } },
          },
        });
      }

      expect(prisma.article.update).toHaveBeenCalledWith({
        where: { id: "test-article-id" },
        data: {
          title: "수정된 게시글",
          content: "수정된 게시글 내용",
        },
        include: { images: true },
      });
    });

    test("이미지 URL이 없는 경우 게시글을 수정한다", async () => {
      (
        prisma.article.findUniqueOrThrow as jest.MockedFunction<typeof prisma.article.findUniqueOrThrow>
      ).mockResolvedValue(mockArticle);
      (prisma.article.update as jest.MockedFunction<typeof prisma.article.update>).mockResolvedValue(mockArticle);

      const result = await updateArticle(
        "test-article-id",
        1,
        { title: "수정된 게시글", content: "수정된 게시글 내용" },
        ""
      );

      expect(result).toEqual(mockArticle);
      expect(prisma.article.findUniqueOrThrow).toHaveBeenCalledWith({
        where: { id: "test-article-id" },
        include: { images: true },
      });

      expect(prisma.image.update).not.toHaveBeenCalled();
      expect(prisma.image.create).not.toHaveBeenCalled();

      expect(prisma.article.update).toHaveBeenCalledWith({
        where: { id: "test-article-id" },
        data: {
          title: "수정된 게시글",
          content: "수정된 게시글 내용",
        },
        include: { images: true },
      });
    });

    test("기존 이미지가 없는 경우 이미지를 생성한다", async () => {
      const mockArticleWithoutImage = { ...mockArticle, images: [] };
      (
        prisma.article.findUniqueOrThrow as jest.MockedFunction<typeof prisma.article.findUniqueOrThrow>
      ).mockResolvedValue(mockArticleWithoutImage);
      (prisma.article.update as jest.MockedFunction<typeof prisma.article.update>).mockResolvedValue(mockArticle);
      (prisma.image.create as jest.MockedFunction<typeof prisma.image.create>).mockResolvedValue(mockArticle.images[0]);

      const result = await updateArticle(
        "test-article-id",
        1,
        { title: "수정된 게시글", content: "수정된 게시글 내용" },
        "image1.jpg"
      );

      expect(result).toEqual(mockArticle);
      expect(prisma.article.findUniqueOrThrow).toHaveBeenCalledWith({
        where: { id: "test-article-id" },
        include: { images: true },
      });

      expect(prisma.image.update).not.toHaveBeenCalled();
      expect(prisma.image.create).toHaveBeenCalledWith({
        data: {
          imagePath: "image1.jpg",
          article: { connect: { id: "test-article-id" } },
        },
      });

      expect(prisma.article.update).toHaveBeenCalledWith({
        where: { id: "test-article-id" },
        data: {
          title: "수정된 게시글",
          content: "수정된 게시글 내용",
        },
        include: { images: true },
      });
    });
  });

  describe("게시글을 삭제한다", () => {
    test("게시글을 삭제한다", async () => {
      (
        prisma.article.findUniqueOrThrow as jest.MockedFunction<typeof prisma.article.findUniqueOrThrow>
      ).mockResolvedValue(mockArticle);
      (prisma.article.delete as jest.MockedFunction<typeof prisma.article.delete>).mockResolvedValue(mockArticle);

      await deleteArticle("test-article-id", 1);

      expect(prisma.article.findUniqueOrThrow).toHaveBeenCalledWith({
        where: { id: "test-article-id" },
      });

      expect(prisma.article.delete).toHaveBeenCalledWith({
        where: { id: "test-article-id" },
      });
    });

    test("존재하지 않는 게시글을 삭제하려고 하면 예외를 발생시킨다", async () => {
      (
        prisma.article.findUniqueOrThrow as jest.MockedFunction<typeof prisma.article.findUniqueOrThrow>
      ).mockRejectedValue(new AppError("존재하지 않는 게시글입니다.", 404));

      await expect(deleteArticle("non-existent-article-id", 1)).rejects.toThrow("존재하지 않는 게시글입니다.");
    });

    test("게시글을 삭제할 권한이 없으면 예외를 발생시킨다", async () => {
      const anotherUserArticle = { ...mockArticle, userId: 2 };
      (
        prisma.article.findUniqueOrThrow as jest.MockedFunction<typeof prisma.article.findUniqueOrThrow>
      ).mockResolvedValue(anotherUserArticle);

      await expect(deleteArticle("test-article-id", 1)).rejects.toThrow("게시글을 삭제할 권한이 없습니다.");
    });
  });

  describe("게시글에 좋아요를 누른다", () => {
    test("게시글에 좋아요를 누른다", async () => {
      const updatedArticle = { ...mockArticle, likeCount: mockArticle.likeCount + 1 };
      (prisma.favorite.findUnique as jest.MockedFunction<typeof prisma.favorite.findUnique>).mockResolvedValue(null);
      (prisma.article.update as jest.MockedFunction<typeof prisma.article.update>).mockResolvedValue(updatedArticle);
      (prisma.$transaction as jest.MockedFunction<typeof prisma.$transaction>).mockResolvedValue([
        null,
        updatedArticle,
      ]);

      const result = await likeArticle("test-article-id", 1);
      expect(result).toEqual(updatedArticle);
      expect(result.likeCount).toBe(mockArticle.likeCount + 1);
      expect(prisma.favorite.findUnique).toHaveBeenCalledWith({
        where: {
          userId_articleId: {
            userId: 1,
            articleId: "test-article-id",
          },
        },
      });
      expect(prisma.$transaction).toHaveBeenCalled();
    });

    test("이미 좋아요가 된 게시글에 좋아요를 누를 경우 에러를 반환한다", async () => {
      (prisma.favorite.findUnique as jest.MockedFunction<typeof prisma.favorite.findUnique>).mockResolvedValue(
        mockFavorite
      );

      await expect(likeArticle("test-article-id", 1)).rejects.toThrow("이미 좋아요 처리된 게시글입니다.");
      expect(prisma.favorite.findUnique).toHaveBeenCalledWith({
        where: {
          userId_articleId: {
            userId: 1,
            articleId: "test-article-id",
          },
        },
      });
    });
  });

  describe("게시글에 좋아요를 취소한다", () => {
    test("게시글에 좋아요를 취소한다", async () => {
      const updatedArticle = { ...mockArticle, likeCount: mockArticle.likeCount - 1 };
      (prisma.favorite.findUnique as jest.MockedFunction<typeof prisma.favorite.findUnique>).mockResolvedValue(
        mockFavorite
      );
      (prisma.article.update as jest.MockedFunction<typeof prisma.article.update>).mockResolvedValue(updatedArticle);
      (prisma.$transaction as jest.MockedFunction<typeof prisma.$transaction>).mockResolvedValue([
        null,
        updatedArticle,
      ]);

      const result = await unlikeArticle("test-article-id", 1);
      expect(result).toEqual(updatedArticle);
      expect(result.likeCount).toBe(mockArticle.likeCount - 1);
      expect(prisma.favorite.findUnique).toHaveBeenCalledWith({
        where: {
          userId_articleId: {
            userId: 1,
            articleId: "test-article-id",
          },
        },
      });
      expect(prisma.$transaction).toHaveBeenCalled();
    });

    test("좋아요가 취소된 게시글을 다시 취소하려고 할 경우 에러를 반환한다", async () => {
      (prisma.favorite.findUnique as jest.MockedFunction<typeof prisma.favorite.findUnique>).mockResolvedValue(null);

      await expect(unlikeArticle("test-article-id", 1)).rejects.toThrow("아직 좋아요 처리되지 않은 게시글입니다.");
      expect(prisma.favorite.findUnique).toHaveBeenCalledWith({
        where: {
          userId_articleId: {
            userId: 1,
            articleId: "test-article-id",
          },
        },
      });
    });
  });
});
