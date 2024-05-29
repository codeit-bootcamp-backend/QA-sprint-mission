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

/**
 * @swagger
 * tags:
 *   name: Images
 *   description: 이미지 관리
 */

/**
 * @swagger
 * /images/upload:
 *   post:
 *     summary: 이미지 업로드
 *     tags: [Images]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: 이미지 업로드 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 url:
 *                   type: string
 *                   example: "http://localhost:3000/uploads/image-123456789.jpg"
 *       400:
 *         description: 이미지 파일이 선택되지 않음
 *         content:
 *          application/json:
 *           schema:
 *            type: object
 *            properties:
 *              message:
 *                type: string
 *                example: "이미지 파일을 선택해주세요."
 */
router.post("/upload", authenticate, upload.single("image"), imageController.uploadImage);

export default router;
