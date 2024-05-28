import express from "express";
import * as commentController from "../controllers/commentController.js";
import * as productController from "../controllers/productController.js";
import authenticate from "../middlewares/authenticate.js";
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: 중고마켓
 */

/**
 * @swagger
 * /products:
 *   get:
 *     summary: 상품 목록 조회
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           example: 0
 *         description: 가져올 데이터의 시작 지점
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *         description: 한 번에 가져올 데이터의 개수
 *       - in: query
 *         name: orderBy
 *         schema:
 *           type: string
 *           enum: [favorite, recent]
 *           example: recent
 *         description: 정렬 기준
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *           example: "상품 이름"
 *         description: 검색 키워드
 *     responses:
 *       200:
 *         description: 상품 목록 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: "1"
 *                   name:
 *                     type: string
 *                     example: "상품 이름"
 *                   description:
 *                     type: string
 *                     example: "상품 설명"
 *                   price:
 *                     type: number
 *                     example: 1000
 *                   favoriteCount:
 *                     type: number
 *                     example: 5
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     example: "2023-01-01T00:00:00.000Z"
 *             examples:
 *               application/json:
 *                 value:
 *                   - id: "1"
 *                     name: "상품 이름"
 *                     description: "상품 설명"
 *                     price: 1000
 *                     favoriteCount: 5
 *                     createdAt: "2023-01-01T00:00:00.000Z"
 *   post:
 *     summary: 상품 생성
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "상품 이름"
 *               description:
 *                 type: string
 *                 example: "상품 설명"
 *               price:
 *                 type: number
 *                 example: 1000
 *     responses:
 *       201:
 *         description: 상품 생성 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "1"
 *                 name:
 *                   type: string
 *                   example: "상품 이름"
 *                 description:
 *                   type: string
 *                   example: "상품 설명"
 *                 price:
 *                   type: number
 *                   example: 1000
 *                 favoriteCount:
 *                   type: number
 *                   example: 5
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2023-01-01T00:00:00.000Z"
 *             examples:
 *               application/json:
 *                 value:
 *                   id: "1"
 *                   name: "상품 이름"
 *                   description: "상품 설명"
 *                   price: 1000
 *                   favoriteCount: 5
 *                   createdAt: "2023-01-01T00:00:00.000Z"
 *       401:
 *         description: 인증 필요
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             examples:
 *               noToken:
 *                 summary: 토큰이 제공되지 않은 경우
 *                 value:
 *                   message: "인증 토큰이 제공되지 않았습니다."
 *               invalidToken:
 *                 summary: 유효하지 않은 토큰인 경우
 *                 value:
 *                   message: "유효하지 않은 토큰입니다."
 */
router.route("/").get(productController.getProducts).post(authenticate, productController.createProduct);

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: 특정 상품 조회
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 상품 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "1"
 *                 name:
 *                   type: string
 *                   example: "상품 이름"
 *                 description:
 *                   type: string
 *                   example: "상품 설명"
 *                 price:
 *                   type: number
 *                   example: 1000
 *                 favoriteCount:
 *                   type: number
 *                   example: 5
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2023-01-01T00:00:00.000Z"
 *             examples:
 *               application/json:
 *                 value:
 *                   id: "1"
 *                   name: "상품 이름"
 *                   description: "상품 설명"
 *                   price: 1000
 *                   favoriteCount: 5
 *                   createdAt: "2023-01-01T00:00:00.000Z"
 *       404:
 *         description: 상품을 찾을 수 없음
 *         content:
 *          application/json:
 *           schema:
 *            type: object
 *            properties:
 *              message:
 *                type: string
 *                example: "존재하지 않는 게시글입니다."
 *   patch:
 *     summary: 상품 수정
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "상품 이름"
 *               description:
 *                 type: string
 *                 example: "상품 설명"
 *               price:
 *                 type: number
 *                 example: 1000
 *     responses:
 *       200:
 *         description: 상품 수정 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "1"
 *                 name:
 *                   type: string
 *                   example: "상품 이름"
 *                 description:
 *                   type: string
 *                   example: "상품 설명"
 *                 price:
 *                   type: number
 *                   example: 1000
 *                 favoriteCount:
 *                   type: number
 *                   example: 5
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2023-01-01T00:00:00.000Z"
 *             examples:
 *               application/json:
 *                 value:
 *                   id: "1"
 *                   name: "상품 이름"
 *                   description: "상품 설명"
 *                   price: 1000
 *                   favoriteCount: 5
 *                   createdAt: "2023-01-01T00:00:00.000Z"
 *       400:
 *         description: 유효성 검사 오류
 *         content:
 *          application/json:
 *           schema:
 *            type: object
 *            properties:
 *              message:
 *                type: string
 *                example: "유효성 검사 오류입니다."
 *       401:
 *         description: 인증 필요
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             examples:
 *               noToken:
 *                 summary: 토큰이 제공되지 않은 경우
 *                 value:
 *                   message: "인증 토큰이 제공되지 않았습니다."
 *               invalidToken:
 *                 summary: 유효하지 않은 토큰인 경우
 *                 value:
 *                   message: "유효하지 않은 토큰입니다."
 *       403:
 *         description: 권한 없음
 *         content:
 *          application/json:
 *           schema:
 *            type: object
 *            properties:
 *              message:
 *                type: string
 *                example: "상품을 수정할 권한이 없습니다."
 *       404:
 *         description: 상품을 찾을 수 없음
 *         content:
 *          application/json:
 *           schema:
 *            type: object
 *            properties:
 *              message:
 *                type: string
 *                example: "존재하지 않는 게시글입니다."
 *   delete:
 *     summary: 상품 삭제
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: 상품 삭제 성공
 *       401:
 *         description: 인증 필요
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             examples:
 *               noToken:
 *                 summary: 토큰이 제공되지 않은 경우
 *                 value:
 *                   message: "인증 토큰이 제공되지 않았습니다."
 *               invalidToken:
 *                 summary: 유효하지 않은 토큰인 경우
 *                 value:
 *                   message: "유효하지 않은 토큰입니다."
 *       403:
 *         description: 권한 없음
 *         content:
 *          application/json:
 *           schema:
 *            type: object
 *            properties:
 *              message:
 *                type: string
 *                example: "상품을 삭제할 권한이 없습니다."
 *       404:
 *         description: 상품을 찾을 수 없음
 *         content:
 *          application/json:
 *           schema:
 *            type: object
 *            properties:
 *              message:
 *                type: string
 *                example: "존재하지 않는 게시글입니다."
 */
router
  .route("/:id")
  .get(productController.getProductById)
  .patch(authenticate, productController.updateProduct)
  .delete(authenticate, productController.deleteProduct);

/**
 * @swagger
 * /products/{id}/like:
 *   patch:
 *     summary: 상품 좋아요
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 상품 좋아요 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "1"
 *                 name:
 *                   type: string
 *                   example: "상품 이름"
 *                 description:
 *                   type: string
 *                   example: "상품 설명"
 *                 price:
 *                   type: number
 *                   example: 1000
 *                 favoriteCount:
 *                   type: number
 *                   example: 5
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2023-01-01T00:00:00.000Z"
 *             examples:
 *               application/json:
 *                 value:
 *                   id: "1"
 *                   name: "상품 이름"
 *                   description: "상품 설명"
 *                   price: 1000
 *                   favoriteCount: 6
 *                   createdAt: "2023-01-01T00:00:00.000Z"
 *       401:
 *         description: 인증 필요
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             examples:
 *               noToken:
 *                 summary: 토큰이 제공되지 않은 경우
 *                 value:
 *                   message: "인증 토큰이 제공되지 않았습니다."
 *               invalidToken:
 *                 summary: 유효하지 않은 토큰인 경우
 *                 value:
 *                   message: "유효하지 않은 토큰입니다."
 *       409:
 *         description: 이미 좋아요 처리된 상품
 *         content:
 *          application/json:
 *           schema:
 *            type: object
 *            properties:
 *              message:
 *                type: string
 *                example: "이미 좋아요 처리된 상품입니다."
 */
router.route("/:id/like").patch(authenticate, productController.likeProduct);

/**
 * @swagger
 * /products/{id}/unlike:
 *   patch:
 *     summary: 상품 좋아요 취소
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 상품 좋아요 취소 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "1"
 *                 name:
 *                   type: string
 *                   example: "상품 이름"
 *                 description:
 *                   type: string
 *                   example: "상품 설명"
 *                 price:
 *                   type: number
 *                   example: 1000
 *                 favoriteCount:
 *                   type: number
 *                   example: 5
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2023-01-01T00:00:00.000Z"
 *             examples:
 *               application/json:
 *                 value:
 *                   id: "1"
 *                   name: "상품 이름"
 *                   description: "상품 설명"
 *                   price: 1000
 *                   favoriteCount: 4
 *                   createdAt: "2023-01-01T00:00:00.000Z"
 *       401:
 *         description: 인증 필요
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             examples:
 *               noToken:
 *                 summary: 토큰이 제공되지 않은 경우
 *                 value:
 *                   message: "인증 토큰이 제공되지 않았습니다."
 *               invalidToken:
 *                 summary: 유효하지 않은 토큰인 경우
 *                 value:
 *                   message: "유효하지 않은 토큰입니다."
 *       409:
 *         description: 아직 좋아요 처리되지 않은 상품
 *         content:
 *          application/json:
 *           schema:
 *            type: object
 *            properties:
 *              message:
 *                type: string
 *                example: "아직 좋아요 처리되지 않은 상품입니다."
 */
router.route("/:id/unlike").patch(authenticate, productController.unlikeProduct);

/**
 * @swagger
 * /products/{productId}/comments:
 *   get:
 *     summary: 특정 상품의 댓글 목록 조회
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 댓글 목록 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: "550e8400-e29b-41d4-a716-446655440000"
 *                   content:
 *                     type: string
 *                     example: "댓글 내용"
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     example: "2023-01-01T00:00:00.000Z"
 *                   writer:
 *                     type: string
 *                     example: "작성자"
 *             examples:
 *               application/json:
 *                 value:
 *                   - id: "550e8400-e29b-41d4-a716-446655440000"
 *                     content: "댓글 내용"
 *                     createdAt: "2023-01-01T00:00:00.000Z"
 *                     writer: "작성자"
 *       404:
 *         description: 게시글을 찾을 수 없음
 *         content:
 *          application/json:
 *           schema:
 *            type: object
 *            properties:
 *              message:
 *                type: string
 *                example: "존재하지 않는 게시글입니다."
 *   post:
 *     summary: 댓글 작성
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: articleId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 example: "댓글 내용"
 *     responses:
 *       201:
 *         description: 댓글 작성 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "550e8400-e29b-41d4-a716-446655440000"
 *                 content:
 *                   type: string
 *                   example: "댓글 내용"
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2023-01-01T00:00:00.000Z"
 *                 writer:
 *                   type: string
 *                   example: "작성자"
 *             examples:
 *               application/json:
 *                 value:
 *                   id: "550e8400-e29b-41d4-a716-446655440000"
 *                   content: "댓글 내용"
 *                   createdAt: "2023-01-01T00:00:00.000Z"
 *                   writer: "작성자"
 *       400:
 *         description: 유효성 검사 오류
 *         content:
 *          application/json:
 *           schema:
 *            type: object
 *            properties:
 *              message:
 *                type: string
 *                example: "유효성 검사 오류입니다."
 *       401:
 *         description: 인증 필요
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             examples:
 *               noToken:
 *                 summary: 토큰이 제공되지 않은 경우
 *                 value:
 *                   message: "인증 토큰이 제공되지 않았습니다."
 *               invalidToken:
 *                 summary: 유효하지 않은 토큰인 경우
 *                 value:
 *                   message: "유효하지 않은 토큰입니다."
 *       404:
 *         description: 게시글을 찾을 수 없음
 *         content:
 *          application/json:
 *           schema:
 *            type: object
 *            properties:
 *              message:
 *                type: string
 *                example: "존재하지 않는 게시글입니다."
 */

router
  .route("/:productId/comments")
  .get(commentController.getCommentsByProductId)
  .post(authenticate, commentController.createComment);

/**
 * @swagger
 * /products/{productId}/comments/{commentId}:
 *   patch:
 *     summary: 댓글 수정
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 example: "댓글 내용"
 *     responses:
 *       200:
 *         description: 댓글 수정 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "550e8400-e29b-41d4-a716-446655440000"
 *                 content:
 *                   type: string
 *                   example: "댓글 내용"
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2023-01-01T00:00:00.000Z"
 *                 writer:
 *                   type: string
 *                   example: "작성자"
 *             examples:
 *               application/json:
 *                 value:
 *                   id: "550e8400-e29b-41d4-a716-446655440000"
 *                   content: "댓글 내용"
 *                   createdAt: "2023-01-01T00:00:00.000Z"
 *                   writer: "작성자"
 *       401:
 *         description: 인증 필요
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             examples:
 *               noToken:
 *                 summary: 토큰이 제공되지 않은 경우
 *                 value:
 *                   message: "인증 토큰이 제공되지 않았습니다."
 *               invalidToken:
 *                 summary: 유효하지 않은 토큰인 경우
 *                 value:
 *                   message: "유효하지 않은 토큰입니다."
 *       403:
 *         description: 권한 없음
 *         content:
 *          application/json:
 *           schema:
 *            type: object
 *            properties:
 *              message:
 *                type: string
 *                example: "이 댓글을 수정할 권한이 없습니다."
 *       404:
 *         description: 댓글을 찾을 수 없음
 *         content:
 *          application/json:
 *           schema:
 *            type: object
 *            properties:
 *              message:
 *                type: string
 *                example: "존재하지 않는 댓글입니다."
 *   delete:
 *     summary: 댓글 삭제
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: articleId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: 댓글 삭제 성공
 *       401:
 *         description: 인증 필요
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             examples:
 *               noToken:
 *                 summary: 토큰이 제공되지 않은 경우
 *                 value:
 *                   message: "인증 토큰이 제공되지 않았습니다."
 *               invalidToken:
 *                 summary: 유효하지 않은 토큰인 경우
 *                 value:
 *                   message: "유효하지 않은 토큰입니다."
 *       403:
 *         description: 권한 없음
 *         content:
 *          application/json:
 *           schema:
 *            type: object
 *            properties:
 *              message:
 *                type: string
 *                example: "이 댓글을 삭제할 권한이 없습니다."
 *       404:
 *         description: 댓글을 찾을 수 없음
 *         content:
 *          application/json:
 *           schema:
 *            type: object
 *            properties:
 *              message:
 *                type: string
 *                example: "존재하지 않는 댓글입니다."
 */

router
  .route("/:productId/comments/:commentId")
  .patch(authenticate, commentController.updateComment)
  .delete(authenticate, commentController.deleteComment);

export default router;
