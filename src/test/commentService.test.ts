import { beforeEach, describe, expect, jest, test } from "@jest/globals";
import { Comment } from "@prisma/client";
import prisma from "../client";
import * as commentService from "../services/commentService";

jest.mock("../client", () => ({
  __esModule: true,
  default: {
    comment: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    user: {
      findUnique: jest.fn(),
    },
    $transaction: jest.fn(),
  },
}));

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

const mockComments: Comment[] = [
  {
    id: "1",
    content: "좋은 게시글!",
    createdAt: new Date(),
    updatedAt: new Date(),
    writer: "사용자1",
    productId: "1",
    articleId: "1",
    userId: 1,
  },
];

describe("Comment Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getCommentsByProductId", () => {
    test("상품 ID로 댓글을 가져와야 한다", async () => {
      (prisma.comment.findMany as jest.MockedFunction<typeof prisma.comment.findMany>).mockResolvedValue(mockComments);

      const comments = await commentService.getCommentsByEntityId('product', "1");

      expect(prisma.comment.findMany).toHaveBeenCalledWith({
        take: 10,
        orderBy: { createdAt: "desc" },
        where: { productId: "1" },
        select: { id: true, content: true, createdAt: true, writer: true },
        cursor: undefined,
        skip: undefined,
      });
      expect(comments).toEqual(mockComments);
    });
  });

  describe("getCommentsByArticleId", () => {
    test("게시글 ID로 댓글을 가져와야 한다", async () => {
      (prisma.comment.findMany as jest.MockedFunction<typeof prisma.comment.findMany>).mockResolvedValue(mockComments);

      const comments = await commentService.getCommentsByEntityId('article',"1");

      expect(prisma.comment.findMany).toHaveBeenCalledWith({
        take: 10,
        orderBy: { createdAt: "desc" },
        where: { articleId: "1" },
        select: { id: true, content: true, createdAt: true, writer: true },
        cursor: undefined,
        skip: undefined,
      });
      expect(comments).toEqual(mockComments);
    });
  });

  describe("createComment", () => {
    test("댓글을 생성해야 한다", async () => {
      const mockComment: Comment = {
        id: "1",
        content: "새로운 댓글",
        writer: "사용자1",
        createdAt: new Date(),
        updatedAt: new Date(),
        productId: "1",
        articleId: null,
        userId: 1,
      };

      (prisma.user.findUnique as jest.MockedFunction<typeof prisma.user.findUnique>).mockResolvedValue(mockUser);
      (prisma.comment.create as jest.MockedFunction<typeof prisma.comment.create>).mockResolvedValue(mockComment);

      const commentData = {
        content: "새로운 댓글",
        userId: 1,
        productId: "1",
      };

      const comment = await commentService.createComment(commentData);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: commentData.userId },
        select: { name: true },
      });
      expect(prisma.comment.create).toHaveBeenCalledWith({
        data: { ...commentData, writer: mockUser.name },
      });
      expect(comment).toEqual(mockComment);
    });

    test("존재하지 않는 사용자는 에러를 발생시켜야 한다", async () => {
      (prisma.user.findUnique as jest.MockedFunction<typeof prisma.user.findUnique>).mockResolvedValue(null);

      const commentData = {
        content: "새로운 댓글",
        userId: 1,
        productId: "1",
      };

      await expect(commentService.createComment(commentData)).rejects.toThrow("User not found");

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: commentData.userId },
        select: { name: true },
      });
      expect(prisma.comment.create).not.toHaveBeenCalled();
    });
  });

  describe("updateComment", () => {
    test("댓글을 업데이트해야 한다", async () => {
      const mockComment: Comment = {
        id: "1",
        content: "기존 댓글",
        createdAt: new Date(),
        updatedAt: new Date(),
        writer: "사용자1",
        productId: "1",
        articleId: null,
        userId: 1,
      };

      const updatedComment: Comment = {
        ...mockComment,
        content: "업데이트된 댓글",
      };

      (prisma.comment.findUnique as jest.MockedFunction<typeof prisma.comment.findUnique>).mockResolvedValue(
        mockComment
      );
      (prisma.comment.update as jest.MockedFunction<typeof prisma.comment.update>).mockResolvedValue(updatedComment);

      const result = await commentService.updateComment("1", 1, "업데이트된 댓글");

      expect(prisma.comment.findUnique).toHaveBeenCalledWith({ where: { id: "1" } });
      expect(prisma.comment.update).toHaveBeenCalledWith({
        where: { id: "1" },
        data: { content: "업데이트된 댓글" },
      });
      expect(result).toEqual(updatedComment);
    });

    test("존재하지 않는 댓글은 에러를 발생시켜야 한다", async () => {
      (prisma.comment.findUnique as jest.MockedFunction<typeof prisma.comment.findUnique>).mockResolvedValue(null);

      await expect(commentService.updateComment("1", 1, "업데이트된 댓글")).rejects.toThrow(
        "존재하지 않는 댓글입니다."
      );

      expect(prisma.comment.findUnique).toHaveBeenCalledWith({ where: { id: "1" } });
      expect(prisma.comment.update).not.toHaveBeenCalled();
    });

    test("다른 사용자의 댓글은 에러를 발생시켜야 한다", async () => {
      const mockComment: Comment = {
        id: "1",
        content: "기존 댓글",
        createdAt: new Date(),
        updatedAt: new Date(),
        writer: "사용자1",
        productId: "1",
        articleId: null,
        userId: 2,
      };

      (prisma.comment.findUnique as jest.MockedFunction<typeof prisma.comment.findUnique>).mockResolvedValue(
        mockComment
      );

      await expect(commentService.updateComment("1", 1, "업데이트된 댓글")).rejects.toThrow(
        "이 댓글을 수정할 권한이 없습니다."
      );

      expect(prisma.comment.findUnique).toHaveBeenCalledWith({ where: { id: "1" } });
      expect(prisma.comment.update).not.toHaveBeenCalled();
    });
  });

  describe("deleteComment", () => {
    test("댓글을 삭제해야 한다", async () => {
      const mockComment: Comment = {
        id: "1",
        content: "기존 댓글",
        createdAt: new Date(),
        updatedAt: new Date(),
        writer: "사용자1",
        productId: "1",
        articleId: null,
        userId: 1,
      };

      (prisma.comment.findUnique as jest.MockedFunction<typeof prisma.comment.findUnique>).mockResolvedValue(
        mockComment
      );
      (prisma.comment.delete as jest.MockedFunction<typeof prisma.comment.delete>).mockResolvedValue(mockComment);

      await commentService.deleteComment("1", 1);

      expect(prisma.comment.findUnique).toHaveBeenCalledWith({ where: { id: "1" } });
      expect(prisma.comment.delete).toHaveBeenCalledWith({ where: { id: "1" } });
    });

    test("존재하지 않는 댓글은 에러를 발생시켜야 한다", async () => {
      (prisma.comment.findUnique as jest.MockedFunction<typeof prisma.comment.findUnique>).mockResolvedValue(null);

      await expect(commentService.deleteComment("1", 1)).rejects.toThrow("존재하지 않는 댓글입니다.");

      expect(prisma.comment.findUnique).toHaveBeenCalledWith({ where: { id: "1" } });
      expect(prisma.comment.delete).not.toHaveBeenCalled();
    });

    test("다른 사용자의 댓글은 에러를 발생시켜야 한다", async () => {
      const mockComment: Comment = {
        id: "1",
        content: "기존 댓글",
        createdAt: new Date(),
        updatedAt: new Date(),
        writer: "사용자1",
        productId: "1",
        articleId: null,
        userId: 2,
      };

      (prisma.comment.findUnique as jest.MockedFunction<typeof prisma.comment.findUnique>).mockResolvedValue(
        mockComment
      );

      await expect(commentService.deleteComment("1", 1)).rejects.toThrow("이 댓글을 삭제할 권한이 없습니다.");

      expect(prisma.comment.findUnique).toHaveBeenCalledWith({ where: { id: "1" } });
      expect(prisma.comment.delete).not.toHaveBeenCalled();
    });
  });
});
