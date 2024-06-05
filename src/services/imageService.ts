import { S3Client } from "@aws-sdk/client-s3";
import { PrismaClient } from "@prisma/client";
import { Request } from "express";
import multer from "multer";
import multerS3 from "multer-s3";

const prisma = new PrismaClient();

const s3Config = new S3Client({
  region: "ap-northeast-2",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

const upload = multer({
  storage: multerS3({
    s3: s3Config,
    bucket: process.env.AWS_S3_BUCKET_NAME || "",
    acl: "public-read",
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      cb(null, `images/${Date.now().toString()}_${file.originalname}`);
    },
  }),
});

export const uploadImageToS3 = upload.single("image");

export const uploadImage = async (req: Request): Promise<string> => {
  const file = req.file as Express.MulterS3File;

  if (!file) {
    throw new Error("이미지 파일을 선택해주세요.");
  }

  const imageUrl: string = file.location;

  await prisma.image.create({
    data: {
      imagePath: imageUrl,
    },
  });

  return imageUrl;
};
