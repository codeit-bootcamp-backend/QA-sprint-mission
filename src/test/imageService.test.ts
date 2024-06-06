import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { beforeEach, describe, expect, jest, test } from "@jest/globals";
import { Request } from "express";
import { generatePresignedUrl } from "../services/imageService";

jest.mock("@aws-sdk/s3-request-presigner");
jest.mock("@aws-sdk/client-s3");

describe("generatePresignedUrl", () => {
  const mockRequest = {
    body: {
      fileName: "test.png",
      fileType: "image/png",
    },
  } as Request;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.AWS_S3_BUCKET_NAME = "test-bucket";
    process.env.AWS_ACCESS_KEY_ID = "test-access-key";
    process.env.AWS_SECRET_ACCESS_KEY = "test-secret-key";
  });

  test("presigned URL을 생성한다", async () => {
    const mockUrl: string = "https://example.com/presigned-url";
    (getSignedUrl as jest.MockedFunction<typeof getSignedUrl>).mockResolvedValue(mockUrl);

    const result = await generatePresignedUrl(mockRequest);

    expect(result).toBe(mockUrl);
    expect(PutObjectCommand).toHaveBeenCalledWith({
      Bucket: "test-bucket",
      Key: expect.stringContaining("images/"),
      ContentType: "image/png",
    });
    expect(getSignedUrl).toHaveBeenCalledWith(expect.any(S3Client), expect.any(PutObjectCommand), { expiresIn: 3600 });
  });

  test("fileName 또는 fileType이 없으면 에러를 발생시킨다", async () => {
    const invalidRequest = {
      body: {},
    } as Request;

    await expect(generatePresignedUrl(invalidRequest)).rejects.toThrow("이미지 파일을 선택해주세요.");
  });
});
