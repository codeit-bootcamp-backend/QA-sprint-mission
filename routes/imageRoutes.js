import express from "express";
import multer from "multer";
import path from "path";
import * as imageController from "../controllers/imageController.js";
import authenticate from "../middlewares/authenticate.js";

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
router.post("/upload", authenticate, upload.single("image"), imageController.uploadImage);

export default router;
