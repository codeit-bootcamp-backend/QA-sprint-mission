import { PrismaClient } from "@prisma/client";
import express from "express";
import multer from "multer";
import path from "path";

const prisma = new PrismaClient();
const SERVER_URL = "http://localhost:3000";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// 이미지 업로드
router.post("/upload", upload.single("image"), async (req, res) => {
  const file = req.file;
  console.log(req);
  if (!file) {
    return res.status(400).send("이미지 파일을 선택해주세요.");
  }
  const imagePath = file.path;
  const imageUrl = `${SERVER_URL}/${imagePath.replace(/\\/g, "/")}`;
  const image = await prisma.image.create({
    data: {
      imagePath: imagePath,
    },
  });

  res.status(200).json({ url: imageUrl });
});

export default router;
