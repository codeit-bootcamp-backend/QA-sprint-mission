import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Request } from "express";

const s3Config = new S3Client({
  region: "ap-northeast-2",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

export const generatePresignedUrl = async (req: Request): Promise<string> => {
  const { fileName, fileType } = req.body;

  if (!fileName || !fileType) {
    throw new Error("이미지 파일을 선택해주세요.");
  }

  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME || "",
    Key: `images/${Date.now().toString()}_${fileName}`,
    ContentType: fileType,
  };

  const command = new PutObjectCommand(params);

  const presignedUrl = await getSignedUrl(s3Config, command, { expiresIn: 3600 });

  return presignedUrl;
};
