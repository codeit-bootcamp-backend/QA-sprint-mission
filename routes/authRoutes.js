import express from "express";
import passport from "../config/passport.js";
import { googleCallback, refreshToken, signIn, signUp } from "../controllers/authController.js";
import asyncHandler from "../utils/asyncHandler.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: 사용자 인증
 */

/**
 * @swagger
 * /auth/signUp:
 *   post:
 *     summary: 사용자 회원가입
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - name
 *               - nickname
 *             properties:
 *               email:
 *                 type: string
 *                 example: "pandaking@example.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 *               name:
 *                 type: string
 *                 example: "김판다"
 *               nickname:
 *                 type: string
 *                 example: "판다의 왕"
 *     responses:
 *       201:
 *         description: 회원가입이 완료되었습니다.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "회원가입이 완료되었습니다."
 *       400:
 *         description: 이미 가입된 이메일입니다.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "이미 가입된 이메일입니다."
 */
router.post("/signUp", asyncHandler(signUp));

/**
 * @swagger
 * /auth/signIn:
 *   post:
 *     summary: 사용자 로그인
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: 로그인 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                 refreshToken:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       401:
 *         description: 이메일과 비밀번호를 확인해주세요.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "이메일과 비밀번호를 확인해주세요."
 */
router.post("/signIn", asyncHandler(signIn));

/**
 * @swagger
 * /auth/refresh-token:
 *   post:
 *     summary: JWT 토큰 갱신
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *     responses:
 *       200:
 *         description: 토큰 갱신 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                 refreshToken:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       401:
 *         description: 유효하지 않은 토큰입니다.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "유효하지 않은 토큰입니다."
 */
router.post("/refresh-token", asyncHandler(refreshToken));

/**
 * @swagger
 * /auth/google:
 *   get:
 *     summary: 구글 인증
 *     tags: [Auth]
 *     responses:
 *       302:
 *         description: 구글 인증 페이지로 리디렉션
 */
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

/**
 * @swagger
 * /auth/google/callback:
 *   get:
 *     summary: 구글 OAuth 콜백
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: 구글 인증 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                 refreshToken:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       401:
 *         description: 구글 인증 실패
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "구글 인증 실패"
 */
router.get("/google/callback", passport.authenticate("google", { failureRedirect: "/" }), googleCallback);

/**
 * @swagger
 * /auth/logout:
 *   get:
 *     summary: 로그아웃
 *     tags: [Auth]
 *     responses:
 *       302:
 *         description: 로그아웃 후 리디렉션
 */
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

export default router;
