import { Router } from "express";
import path from "path";
import multer from "multer";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // 업로드된 파일을 저장할 디렉토리 지정
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // 파일 이름에 현재 시간을 추가하여 고유하게 만듦
  },
});

// Multer 미들웨어 설정
export const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 파일 크기 제한 (10MB)
  fileFilter: (req, file, cb) => {
    // 이미지 파일만 허용
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("이미지 파일이 아닙니다"), false);
    }
    cb(null, true);
  },
});

const imageUploadRoutes = Router();

imageUploadRoutes.post("", upload.array("images", 10), (req, res) => {
  try {
    const fileUrls = req.files.map((file) => {
      return `${req.protocol}://${req.get("host")}/uploads/${file.filename}`;
    });
    res.send({
      message: "파일이 성공적으로 업로드되었습니다",
      fileUrls: fileUrls,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({ error: error.message });
  }
});

imageUploadRoutes.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // Multer 관련 오류 처리
    res.status(400).send({ error: err.message });
  } else if (err) {
    // 일반 오류 처리
    res.status(500).send({ error: err.message });
  }
});

export default imageUploadRoutes;
