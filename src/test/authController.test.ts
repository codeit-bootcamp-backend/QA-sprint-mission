import { describe, expect, jest, test } from "@jest/globals";
import dotenv from "dotenv";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { StructError, assert } from "superstruct";
import { googleCallback, refreshToken, signIn, signUp } from "../controllers/authController";
import { createUser, findUserByEmail, findUserById, validatePassword } from "../services/authService";
import { generateAccessToken, generateRefreshToken, regenerateRefreshToken } from "../utils/tokens";

interface JWTPayload {
  userId: number;
}

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || "kingPanda";

jest.mock("../services/authService");
jest.mock("../utils/tokens");
jest.mock("jsonwebtoken");
jest.mock("superstruct", () => {
  const originalModule = jest.requireActual<typeof import("superstruct")>("superstruct");
  return {
    ...originalModule,
    assert: jest.fn(),
  };
});

describe("Auth Controller - 회원가입", () => {
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

  test("유효성 검사 오류가 발생하면 400 상태 코드를 반환한다", async () => {
    const { req, res } = setup();

    req.body.email = "";

    const failure = {
      type: "email",
      value: req.body.email,
      key: "email",
      branch: [req.body],
      path: ["email"],
      refinement: undefined,
      message: "Invalid email format",
    };

    const structError = new StructError(failure, function* () {
      yield failure;
    });

    (assert as jest.Mock).mockImplementation(() => {
      throw structError;
    });

    await signUp(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "유효성 검사 오류입니다.",
      errors: [{ path: "email", message: "Invalid email format" }],
    });
  });

  test("이미 존재하는 이메일로 회원가입하면 400 상태 코드를 반환한다", async () => {
    const { req, res } = setup();
    (assert as jest.Mock).mockImplementation(() => {});
    const mockUser = {
      id: 1,
      googleId: null,
      email: "asdf@example.com",
      name: null,
      nickname: "existinguser",
      image: null,
      password: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    (findUserByEmail as jest.MockedFunction<typeof findUserByEmail>).mockResolvedValue(mockUser);

    await signUp(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "이미 가입된 이메일입니다." });
  });

  test("StructError가 발생하면 400 상태 코드를 반환한다", async () => {
    const { req, res } = setup();

    const failure = {
      type: "email",
      value: req.body.email,
      key: "email",
      branch: [req.body],
      path: ["email"],
      refinement: undefined,
      message: "Invalid email format",
    };

    const structError = new StructError(failure, function* () {
      yield failure;
    });

    (assert as jest.Mock).mockImplementation(() => {
      throw structError;
    });

    await signUp(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "유효성 검사 오류입니다.",
      errors: [{ path: "email", message: "Invalid email format" }],
    });
  });

  test("일반적인 오류가 발생하면 500 상태 코드를 반환한다", async () => {
    const { req, res } = setup();
    (assert as jest.Mock).mockImplementation(() => {});
    (findUserByEmail as jest.MockedFunction<typeof findUserByEmail>).mockResolvedValue(null);
    (createUser as jest.MockedFunction<typeof createUser>).mockImplementation(() => {
      throw new Error("Database error");
    });

    await signUp(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "서버 에러입니다." });
  });

  test("성공적으로 회원가입하면 201 상태 코드를 반환한다", async () => {
    const { req, res } = setup();
    (assert as jest.Mock).mockImplementation(() => {});
    (findUserByEmail as jest.MockedFunction<typeof findUserByEmail>).mockResolvedValue(null);
    (createUser as jest.MockedFunction<typeof createUser>).mockResolvedValue({
      id: 1,
      email: req.body.email,
      name: req.body.name,
      nickname: req.body.nickname,
      password: req.body.password,
      googleId: null,
      image: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await signUp(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ message: "회원가입이 완료되었습니다." });
  });
});

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
      email: "test@example.com",
      password: "hashedPassword",
      createdAt: new Date(),
      updatedAt: new Date(),
      googleId: null,
      name: null,
      nickname: "",
      image: null,
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
      email: "test@example.com",
      password: "hashedPassword",
      createdAt: new Date(),
      updatedAt: new Date(),
      googleId: null,
      name: null,
      nickname: "",
      image: null,
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

  test("입력된 이메일 형식이 유효하지 않으면 401 상태 코드를 반환한다", async () => {
    const req = {
      body: {
        email: "invalid-email",
        password: "password",
      },
    } as Request;

    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    } as unknown as Response;

    await signIn(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "이메일과 비밀번호를 확인해주세요." });
  });
});

describe("Auth Controller - refreshToken", () => {
  const setup = () => {
    const req = {
      body: {
        refreshToken: "validToken",
      },
    } as Request;

    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    } as unknown as Response;

    const next = jest.fn() as NextFunction;

    return { req, res, next };
  };

  test("유효한 토큰이면 새로운 액세스 토큰과 리프레시 토큰을 반환한다", async () => {
    const { req, res } = setup();
    const mockUser = {
      id: 1,
      email: "test@example.com",
      password: "hashedPassword",
      createdAt: new Date(),
      updatedAt: new Date(),
      googleId: null,
      name: null,
      nickname: "",
      image: null,
    };

    (regenerateRefreshToken as jest.MockedFunction<typeof regenerateRefreshToken>).mockReturnValue("validToken");
    (jwt.verify as jest.Mock).mockReturnValue({ userId: mockUser.id } as JWTPayload);
    (findUserById as jest.MockedFunction<typeof findUserById>).mockResolvedValue(mockUser);
    (generateAccessToken as jest.MockedFunction<typeof generateAccessToken>).mockReturnValue("newAccessToken");

    await refreshToken(req, res);

    expect(jwt.verify).toHaveBeenCalledWith("validToken", JWT_SECRET);
    expect(res.json).toHaveBeenCalledWith({ accessToken: "newAccessToken", refreshToken: "validToken" });
  });

  test("유효하지 않은 토큰이면 401 상태 코드를 반환한다", async () => {
    const { req, res } = setup();

    (regenerateRefreshToken as jest.MockedFunction<typeof regenerateRefreshToken>).mockImplementation(() => {
      throw new Error("Invalid token");
    });

    await refreshToken(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "유효하지 않은 토큰입니다." });
  });

  test("토큰이 없으면 401 상태 코드를 반환한다", async () => {
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

  test("findUserById가 null을 반환하면 401 상태 코드를 반환한다", async () => {
    const { req, res } = setup();

    (regenerateRefreshToken as jest.MockedFunction<typeof regenerateRefreshToken>).mockReturnValue("newRefreshToken");
    (jwt.verify as jest.Mock).mockReturnValue({ userId: 1 } as JWTPayload);
    (findUserById as jest.MockedFunction<typeof findUserById>).mockResolvedValue(null);

    await refreshToken(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "유효하지 않은 토큰입니다." });
  });
});
describe("Auth Controller - googleCallback", () => {
  const setup = () => {
    const req = {} as Request;
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    } as unknown as Response;
    const next = jest.fn();

    return { req, res, next };
  };

  test("사용자 정보가 없으면 에러를 반환한다", () => {
    const { req, res, next } = setup();

    googleCallback(req, res, next);

    expect(next).toHaveBeenCalledWith(new Error("사용자 정보를 찾을 수 없습니다."));
  });

  test("사용자 정보가 있으면 토큰을 반환한다", () => {
    const { req, res, next } = setup();
    req.user = {
      _id: 1,
      accessToken: "accessToken",
      refreshToken: "refreshToken",
    };

    googleCallback(req, res, next);

    expect(res.json).toHaveBeenCalledWith({ accessToken: "accessToken", refreshToken: "refreshToken" });
  });
});
