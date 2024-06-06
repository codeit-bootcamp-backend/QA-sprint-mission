import { beforeEach, describe, expect, jest, test } from "@jest/globals";
import { Prisma } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import AppError from "../utils/errors";

const mockRequest = {} as Request;
const mockResponse = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
} as unknown as Response;
const mockNext = jest.fn() as NextFunction;

describe("asyncHandler", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    console.error = jest.fn();
  });

  test("AppError를 처리하고 올바른 응답을 반환해야 한다", async () => {
    const handler = jest.fn(async () => {
      throw new AppError("Test AppError", 400);
    });
    const wrappedHandler = asyncHandler(handler);

    await wrappedHandler(mockRequest, mockResponse, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: "Test AppError" });
  });

  test("PrismaClientValidationError를 처리하고 올바른 응답을 반환해야 한다", async () => {
    const validationError = new Prisma.PrismaClientValidationError("Test PrismaClientValidationError", {
      clientVersion: "1.2.3",
    });

    const handler = jest.fn(async () => {
      throw validationError;
    });
    const wrappedHandler = asyncHandler(handler);

    await wrappedHandler(mockRequest, mockResponse, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: "Test PrismaClientValidationError" });
  });

  test("PrismaClientKnownRequestError를 처리하고 올바른 응답을 반환해야 한다", async () => {
    const knownRequestError = new Prisma.PrismaClientKnownRequestError("Test PrismaClientKnownRequestError", {
      code: "P2025",
      clientVersion: "1.2.3",
    });

    const handler = jest.fn(async () => {
      throw knownRequestError;
    });
    const wrappedHandler = asyncHandler(handler);

    await wrappedHandler(mockRequest, mockResponse, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: "존재하지 않는 게시글입니다." });
  });

  test("알 수 없는 에러를 처리하고 올바른 응답을 반환해야 한다", async () => {
    const handler = jest.fn(async () => {
      throw new Error("Test Error");
    });
    const wrappedHandler = asyncHandler(handler);

    await wrappedHandler(mockRequest, mockResponse, mockNext);

    expect(console.error).toHaveBeenCalledWith(new Error("Test Error"));
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: "서버 에러입니다." });
  });
});
