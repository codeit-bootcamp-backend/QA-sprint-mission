import { beforeEach, describe, expect, jest, test } from "@jest/globals";
import { Prisma, User } from "@prisma/client";
import bcrypt from "bcrypt";
import prisma from "../client";
import { createUser, findUserByEmail, findUserById, validatePassword } from "../services/authService";

jest.mock("../client", () => ({
  __esModule: true,
  default: {
    user: {
      create: jest.fn(),
      findUnique: jest.fn(),
    },
  },
}));

jest.mock("bcrypt", () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

describe("회원가입, 로그인", () => {
  const mockUser: User = {
    id: 1,
    googleId: null,
    email: "test@example.com",
    name: "테스트 유저",
    nickname: "testuser",
    image: null,
    password: "hashedPassword",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("사용자를 생성한다", async () => {
    (bcrypt.hash as jest.MockedFunction<(a: string, b: number) => Promise<string>>).mockResolvedValue("hashedPassword");
    (prisma.user.create as jest.MockedFunction<typeof prisma.user.create>).mockResolvedValue(mockUser);

    const result = await createUser("test@example.com", "password", "Test User", "testuser");

    expect(result).toEqual(mockUser);
    expect(bcrypt.hash).toHaveBeenCalledWith("password", 10);
    expect(prisma.user.create).toHaveBeenCalledWith({
      data: {
        email: "test@example.com",
        password: "hashedPassword",
        name: "Test User",
        nickname: "testuser",
      },
    });
  });

  test("이미 존재하는 이메일로 사용자를 생성하려고 하면 예외를 발생시킨다", async () => {
    (bcrypt.hash as jest.MockedFunction<(a: string, b: number) => Promise<string>>).mockResolvedValue("hashedPassword");
    (prisma.user.create as jest.MockedFunction<typeof prisma.user.create>).mockRejectedValue(
      new Prisma.PrismaClientKnownRequestError("이미 존재하는 이메일입니다.", {
        code: "P2002",
        clientVersion: "3.0.0",
      })
    );

    await expect(createUser("test@example.com", "password", "Test User", "testuser")).rejects.toThrow(
      "이미 존재하는 이메일입니다."
    );
  });

  test("다른 예외가 발생하면 예외를 다시 발생시킨다", async () => {
    (bcrypt.hash as jest.MockedFunction<(a: string, b: number) => Promise<string>>).mockResolvedValue("hashedPassword");
    (prisma.user.create as jest.MockedFunction<typeof prisma.user.create>).mockRejectedValue(
      new Error("Database connection error")
    );

    await expect(createUser("test@example.com", "password", "Test User", "testuser")).rejects.toThrow(
      "Database connection error"
    );
  });

  test("이메일로 사용자를 찾는다", async () => {
    (prisma.user.findUnique as jest.MockedFunction<typeof prisma.user.findUnique>).mockResolvedValue(mockUser);

    const result = await findUserByEmail("test@example.com");

    expect(result).toEqual(mockUser);
    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { email: "test@example.com" },
    });
  });

  test("ID로 사용자를 찾는다", async () => {
    (prisma.user.findUnique as jest.MockedFunction<typeof prisma.user.findUnique>).mockResolvedValue(mockUser);

    const result = await findUserById(1);

    expect(result).toEqual(mockUser);
    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { id: 1 },
    });
  });

  test("비밀번호를 검증한다", async () => {
    (bcrypt.compare as jest.MockedFunction<(a: string, b: string) => Promise<boolean>>).mockResolvedValue(true);

    const result = await validatePassword("inputPassword", "hashedPassword");

    expect(result).toBe(true);
    expect(bcrypt.compare).toHaveBeenCalledWith("inputPassword", "hashedPassword");
  });

  test("잘못된 비밀번호를 검증한다", async () => {
    (bcrypt.compare as jest.MockedFunction<(a: string, b: string) => Promise<boolean>>).mockResolvedValue(false);

    const result = await validatePassword("wrongPassword", "hashedPassword");

    expect(result).toBe(false);
    expect(bcrypt.compare).toHaveBeenCalledWith("wrongPassword", "hashedPassword");
  });
});
