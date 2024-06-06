import { afterEach, beforeEach, describe, expect, jest, test } from "@jest/globals";
import { NextFunction, Request, Response } from "express";
import { getPresignedUrl } from "../controllers/imageController";
import * as imageService from "../services/imageService";
import AppError from "../utils/errors";

jest.mock("../services/imageService");

const setup = () => {
  const req = {
    body: {
      fileName: "test.png",
      fileType: "image/png",
    },
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

describe("getPresignedUrl", () => {
  let originalConsoleError: any;

  beforeEach(() => {
    jest.clearAllMocks();
    originalConsoleError = console.error;
    console.error = jest.fn(); // suppress console.error during tests
  });

  afterEach(() => {
    console.error = originalConsoleError;
  });

  test("성공적으로 presigned URL을 반환해야 한다", async () => {
    const { req, res, next } = setup();

    const mockUrl = "https://example.com/presigned-url";
    (
      imageService.generatePresignedUrl as jest.MockedFunction<typeof imageService.generatePresignedUrl>
    ).mockResolvedValue(mockUrl);

    await getPresignedUrl(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ url: mockUrl });
    expect(next).not.toHaveBeenCalled();
  });

  test("fileName 또는 fileType이 없을 경우 AppError를 반환해야 한다", async () => {
    const { req, res, next } = setup();
    req.body = {};

    (
      imageService.generatePresignedUrl as jest.MockedFunction<typeof imageService.generatePresignedUrl>
    ).mockRejectedValue(new AppError("이미지 파일을 선택해주세요.", 400));

    await getPresignedUrl(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "이미지 파일을 선택해주세요." });
  });

  test("service에서 발생한 다른 에러를 반환해야 한다", async () => {
    const { req, res, next } = setup();
    (
      imageService.generatePresignedUrl as jest.MockedFunction<typeof imageService.generatePresignedUrl>
    ).mockRejectedValue(new AppError("서버 에러입니다.", 500));

    await getPresignedUrl(req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "서버 에러입니다." });
  });
});
