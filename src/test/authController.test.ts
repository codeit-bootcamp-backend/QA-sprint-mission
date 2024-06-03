import { describe, expect, jest, test } from "@jest/globals";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { refreshToken, signIn, signUp } from "../controllers/authController";
import { createUser, findUserByEmail, findUserById, validatePassword } from "../services/authService";
import { generateAccessToken, generateRefreshToken, regenerateRefreshToken } from "../utils/tokens";

jest.mock("../services/authService");
jest.mock("../utils/tokens");
jest.mock("jsonwebtoken");

describe("Auth Controller - signIn", () => {
  const setup = () => {
    const req = {
      body: {
        email: "test@example.com",
        password: "password",
      },
    } as Request;

    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    } as unknown as Response;

    return { req, res };
  };

  test("성공적으로 로그인하면 토큰을 반환한다", async () => {
    const mockUser = {
      id: 1,
      googleId: null,
      email: "test@example.com",
      name: null,
      nickname: "",
      image: null,
      password: "hashedPassword",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const { req, res } = setup();

    (findUserByEmail as jest.MockedFunction<typeof findUserByEmail>).mockResolvedValue(mockUser);
    (validatePassword as jest.MockedFunction<typeof validatePassword>).mockResolvedValue(true);
    (generateAccessToken as jest.MockedFunction<typeof generateAccessToken>).mockReturnValue("accessToken");
    (generateRefreshToken as jest.MockedFunction<typeof generateRefreshToken>).mockReturnValue("refreshToken");

    await signIn(req, res);

    expect(findUserByEmail).toHaveBeenCalledWith("test@example.com");
    expect(validatePassword).toHaveBeenCalledWith("password", "hashedPassword");
    expect(generateAccessToken).toHaveBeenCalledWith(mockUser);
    expect(generateRefreshToken).toHaveBeenCalledWith(mockUser);
    expect(res.json).toHaveBeenCalledWith({ accessToken: "accessToken", refreshToken: "refreshToken" });
  });

  test("비밀번호가 틀리면 401 상태 코드를 반환한다", async () => {
    const { req, res } = setup();

    const mockUser = {
      id: 1,
      googleId: null,
      email: "test@example.com",
      name: null,
      nickname: "",
      image: null,
      password: "hashedPassword",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    (findUserByEmail as jest.MockedFunction<typeof findUserByEmail>).mockResolvedValue(mockUser);
    (validatePassword as jest.MockedFunction<typeof validatePassword>).mockResolvedValue(false);

    await signIn(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "이메일과 비밀번호를 확인해주세요." });
  });

  test("사용자가 존재하지 않으면 401 상태 코드를 반환한다", async () => {
    const { req, res } = setup();

    (findUserByEmail as jest.MockedFunction<typeof findUserByEmail>).mockResolvedValue(null);

    await signIn(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "이메일과 비밀번호를 확인해주세요." });
  });

  test("입력된 이메일이 없으면 400 상태 코드를 반환한다", async () => {
    const req = {
      body: {
        email: "",
        password: "password",
      },
    } as Request;

    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    } as unknown as Response;

    await signIn(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "이메일과 비밀번호를 입력해주세요." });
  });

  test("입력된 비밀번호가 없으면 400 상태 코드를 반환한다", async () => {
    const req = {
      body: {
        email: "test@example.com",
        password: "",
      },
    } as Request;

    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    } as unknown as Response;

    await signIn(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "이메일과 비밀번호를 입력해주세요." });
  });
});

describe("Auth Controller - signUp", () => {
  const mockUser = {
    id: 1,
    email: "test@example.com",
    name: "Test User",
    nickname: "testuser",
    password: "hashedPassword",
    googleId: null,
    image: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const setup = () => {
    const req = {
      body: {
        email: "newuser@example.com",
        password: "password",
        name: "New User",
        nickname: "newuser",
      },
    } as Request;

    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    } as unknown as Response;

    return { req, res };
  };

  test("성공적으로 회원가입하면 201 상태 코드를 반환한다", async () => {
    const { req, res } = setup();

    (findUserByEmail as jest.MockedFunction<typeof findUserByEmail>).mockResolvedValue(null);
    (createUser as jest.MockedFunction<typeof createUser>).mockResolvedValue(mockUser);

    await signUp(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ message: "회원가입이 완료되었습니다." });
  });

  test("이미 존재하는 이메일로 회원가입하면 400 상태 코드를 반환한다", async () => {
    const { req, res } = setup();

    (findUserByEmail as jest.MockedFunction<typeof findUserByEmail>).mockResolvedValue(mockUser);

    await signUp(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "이미 가입된 이메일입니다." });
  });

  test("입력된 이메일이 없으면 400 상태 코드를 반환한다", async () => {
    const req = {
      body: {
        email: "",
        password: "password",
        name: "New User",
        nickname: "newuser",
      },
    } as Request;

    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    } as unknown as Response;

    await signUp(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: '잘못된 입력값입니다: At path: email -- Expected a value of type `Email`, but received: `""`',
    });
  });

  test("입력된 비밀번호가 없으면 400 상태 코드를 반환한다", async () => {
    const req = {
      body: {
        email: "newuser@example.com",
        password: "",
        name: "New User",
        nickname: "newuser",
      },
    } as Request;

    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    } as unknown as Response;

    await signUp(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message:
        "잘못된 입력값입니다: At path: password -- Expected a string with a length between `1` and `32` but received one with a length of `0`",
    });
  });

  test("입력된 이름이 없으면 400 상태 코드를 반환한다", async () => {
    const req = {
      body: {
        email: "newuser@example.com",
        password: "password",
        name: "",
        nickname: "newuser",
      },
    } as Request;

    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    } as unknown as Response;

    await signUp(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message:
        "잘못된 입력값입니다: At path: name -- Expected a string with a length between `1` and `16` but received one with a length of `0`",
    });
  });

  test("입력된 닉네임이 없으면 400 상태 코드를 반환한다", async () => {
    const req = {
      body: {
        email: "newuser@example.com",
        password: "password",
        name: "New User",
        nickname: "",
      },
    } as Request;

    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    } as unknown as Response;

    await signUp(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message:
        "잘못된 입력값입니다: At path: nickname -- Expected a string with a length between `1` and `16` but received one with a length of `0`",
    });
  });
});

describe("Auth Controller - refreshToken", () => {
  const setup = () => {
    const req = {
      body: {
        refreshToken: "validRefreshToken",
      },
    } as Request;

    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    } as unknown as Response;

    return { req, res };
  };

  const decodedToken = { userId: 1 };

  test("유효한 refresh token으로 새로운 access token과 refresh token을 반환한다", async () => {
    const mockUser = {
      id: 1,
      googleId: null,
      email: "test@example.com",
      name: null,
      nickname: "testuser",
      image: null,
      password: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const { req, res } = setup();

    (jwt.verify as jest.MockedFunction<typeof jwt.verify>).mockReturnValue(decodedToken as any);
    (findUserById as jest.MockedFunction<typeof findUserById>).mockResolvedValue(mockUser);
    (generateAccessToken as jest.MockedFunction<typeof generateAccessToken>).mockReturnValue("newAccessToken");
    (regenerateRefreshToken as jest.MockedFunction<typeof regenerateRefreshToken>).mockReturnValue("newRefreshToken");

    await refreshToken(req, res);

    expect(jwt.verify).toHaveBeenCalledWith("newRefreshToken", "kingPanda");
    expect(findUserById).toHaveBeenCalledWith(1);
    expect(generateAccessToken).toHaveBeenCalledWith(mockUser);
    expect(regenerateRefreshToken).toHaveBeenCalledWith("validRefreshToken");
    expect(res.json).toHaveBeenCalledWith({ accessToken: "newAccessToken", refreshToken: "newRefreshToken" });
  });

  test("유효하지 않은 refresh token으로 401 상태 코드를 반환한다", async () => {
    const { req, res } = setup();

    (jwt.verify as jest.MockedFunction<typeof jwt.verify>).mockImplementation(() => {
      throw new Error("Invalid token");
    });

    await refreshToken(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "유효하지 않은 토큰입니다." });
  });

  test("refresh token이 없으면 401 상태 코드를 반환한다", async () => {
    const req = {
      body: {},
    } as Request;

    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    } as unknown as Response;

    await refreshToken(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "토큰은 필수값입니다." });
  });
});
