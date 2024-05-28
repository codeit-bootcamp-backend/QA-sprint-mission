import express from "express";
import * as articleController from "../controllers/articleController.js";
import * as commentController from "../controllers/commentController.js";
import authenticate from "../middlewares/authenticate.js";
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Articles
 *   description: 자유게시판
 */

/**
 * @swagger
 * /articles:
 *   get:
 *     summary: 게시글 목록 조회
 *     tags: [Articles]
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
 *           enum: [like, recent]
 *           example: recent
 *         description: 정렬 기준
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *           example: "게시글 제목"
 *         description: 검색 키워드
 *     responses:
 *       200:
 *         description: 게시글 목록 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 articles:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "550e8400-e29b-41d4-a716-446655440000"
 *                       title:
 *                         type: string
 *                         example: "게시글 제목"
 *                       content:
 *                         type: string
 *                         example: "게시글 내용"
 *                       imageUrl:
 *                         type: string
 *                         example: "http://example.com/image.jpg"
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2023-01-01T00:00:00.000Z"
 *                       likeCount:
 *                         type: number
 *                         example: 5
 *                       writer:
 *                         type: string
 *                         example: "작성자"
 *                 bestArticles:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "550e8400-e29b-41d4-a716-446655440000"
 *                       title:
 *                         type: string
 *                         example: "인기 게시글 제목"
 *                       content:
 *                         type: string
 *                         example: "인기 게시글 내용"
 *                       imageUrl:
 *                         type: string
 *                         example: "http://example.com/image.jpg"
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2023-01-01T00:00:00.000Z"
 *                       likeCount:
 *                         type: number
 *                         example: 10
 *                       writer:
 *                         type: string
 *                         example: "작성자"
 *             examples:
 *               application/json:
 *                 value:
 *                   articles:
 *                     - id: "550e8400-e29b-41d4-a716-446655440000"
 *                       title: "게시글 제목"
 *                       content: "게시글 내용"
 *                       imageUrl: "http://example.com/image.jpg"
 *                       createdAt: "2023-01-01T00:00:00.000Z"
 *                       likeCount: 5
 *                       writer: "작성자"
 *                   bestArticles:
 *                     - id: "550e8400-e29b-41d4-a716-446655440000"
 *                       title: "인기 게시글 제목"
 *                       content: "인기 게시글 내용"
 *                       imageUrl: "http://example.com/image.jpg"
 *                       createdAt: "2023-01-01T00:00:00.000Z"
 *                       likeCount: 10
 *                       writer: "작성자"
 *   post:
 *     summary: 게시글 생성
 *     tags: [Articles]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "게시글 제목"
 *               content:
 *                 type: string
 *                 example: "게시글 내용"
 *               imageUrl:
 *                 type: string
 *                 example: "http://example.com/image.jpg"
 *     responses:
 *       201:
 *         description: 게시글 생성 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "550e8400-e29b-41d4-a716-446655440000"
 *                 title:
 *                   type: string
 *                   example: "게시글 제목"
 *                 content:
 *                   type: string
 *                   example: "게시글 내용"
 *                 imageUrl:
 *                   type: string
 *                   example: "http://example.com/image.jpg"
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2023-01-01T00:00:00.000Z"
 *                 likeCount:
 *                   type: number
 *                   example: 0
 *                 writer:
 *                   type: string
 *                   example: "작성자"
 *             examples:
 *               application/json:
 *                 value:
 *                   id: "550e8400-e29b-41d4-a716-446655440000"
 *                   title: "게시글 제목"
 *                   content: "게시글 내용"
 *                   imageUrl: "http://example.com/image.jpg"
 *                   createdAt: "2023-01-01T00:00:00.000Z"
 *                   likeCount: 0
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
 *
 */
router.route("/").get(articleController.getArticles).post(authenticate, articleController.createArticle);
/**
 * @swagger
 * /articles/{id}:
 *   get:
 *     summary: 특정 게시글 조회
 *     tags: [Articles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 게시글 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "550e8400-e29b-41d4-a716-446655440000"
 *                 title:
 *                   type: string
 *                   example: "게시글 제목"
 *                 content:
 *                   type: string
 *                   example: "게시글 내용"
 *                 imageUrl:
 *                   type: string
 *                   example: "http://example.com/image.jpg"
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2023-01-01T00:00:00.000Z"
 *                 likeCount:
 *                   type: number
 *                   example: 5
 *                 writer:
 *                   type: string
 *                   example: "작성자"
 *             examples:
 *               application/json:
 *                 value:
 *                   id: "550e8400-e29b-41d4-a716-446655440000"
 *                   title: "게시글 제목"
 *                   content: "게시글 내용"
 *                   imageUrl: "http://example.com/image.jpg"
 *                   createdAt: "2023-01-01T00:00:00.000Z"
 *                   likeCount: 5
 *                   writer: "작성자"
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
 *   patch:
 *     summary: 게시글 수정
 *     tags: [Articles]
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
 *               title:
 *                 type: string
 *                 example: "게시글 제목"
 *               content:
 *                 type: string
 *                 example: "게시글 내용"
 *               imageUrl:
 *                 type: string
 *                 example: "http://example.com/image.jpg"
 *     responses:
 *       200:
 *         description: 게시글 수정 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "550e8400-e29b-41d4-a716-446655440000"
 *                 title:
 *                   type: string
 *                   example: "게시글 제목"
 *                 content:
 *                   type: string
 *                   example: "게시글 내용"
 *                 imageUrl:
 *                   type: string
 *                   example: "http://example.com/image.jpg"
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2023-01-01T00:00:00.000Z"
 *                 likeCount:
 *                   type: number
 *                   example: 5
 *                 writer:
 *                   type: string
 *                   example: "작성자"
 *             examples:
 *               application/json:
 *                 value:
 *                   id: "550e8400-e29b-41d4-a716-446655440000"
 *                   title: "게시글 제목"
 *                   content: "게시글 내용"
 *                   imageUrl: "http://example.com/image.jpg"
 *                   createdAt: "2023-01-01T00:00:00.000Z"
 *                   likeCount: 5
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
 *       403:
 *         description: 권한 없음
 *         content:
 *          application/json:
 *           schema:
 *            type: object
 *            properties:
 *              message:
 *                type: string
 *                example: "게시글을 수정할 권한이 없습니다."
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
 *   delete:
 *     summary: 게시글 삭제
 *     tags: [Articles]
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
 *         description: 게시글 삭제 성공
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
 *                example: "게시글을 삭제할 권한이 없습니다."
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
  .route("/:id")
  .get(articleController.getArticleById)
  .patch(authenticate, articleController.updateArticle)
  .delete(authenticate, articleController.deleteArticle);

/**
 * @swagger
 * /articles/{id}/like:
 *   patch:
 *     summary: 게시글 좋아요
 *     tags: [Articles]
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
 *         description: 게시글 좋아요 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "550e8400-e29b-41d4-a716-446655440000"
 *                 title:
 *                   type: string
 *                   example: "게시글 제목"
 *                 content:
 *                   type: string
 *                   example: "게시글 내용"
 *                 imageUrl:
 *                   type: string
 *                   example: "http://example.com/image.jpg"
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2023-01-01T00:00:00.000Z"
 *                 likeCount:
 *                   type: number
 *                   example: 6
 *                 writer:
 *                   type: string
 *                   example: "작성자"
 *             examples:
 *               application/json:
 *                 value:
 *                   id: "550e8400-e29b-41d4-a716-446655440000"
 *                   title: "게시글 제목"
 *                   content: "게시글 내용"
 *                   imageUrl: "http://example.com/image.jpg"
 *                   createdAt: "2023-01-01T00:00:00.000Z"
 *                   likeCount: 6
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
 *       409:
 *         description: 이미 좋아요 처리된 게시글
 *         content:
 *          application/json:
 *           schema:
 *            type: object
 *            properties:
 *              message:
 *                type: string
 *                example: "이미 좋아요 처리된 게시글입니다."
 */
router.route("/:id/like").patch(authenticate, articleController.likeArticle);

/**
 * @swagger
 * /articles/{id}/unlike:
 *   patch:
 *     summary: 게시글 좋아요 취소
 *     tags: [Articles]
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
 *         description: 게시글 좋아요 취소 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "550e8400-e29b-41d4-a716-446655440000"
 *                 title:
 *                   type: string
 *                   example: "게시글 제목"
 *                 content:
 *                   type: string
 *                   example: "게시글 내용"
 *                 imageUrl:
 *                   type: string
 *                   example: "http://example.com/image.jpg"
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2023-01-01T00:00:00.000Z"
 *                 likeCount:
 *                   type: number
 *                   example: 4
 *                 writer:
 *                   type: string
 *                   example: "작성자"
 *             examples:
 *               application/json:
 *                 value:
 *                   id: "550e8400-e29b-41d4-a716-446655440000"
 *                   title: "게시글 제목"
 *                   content: "게시글 내용"
 *                   imageUrl: "http://example.com/image.jpg"
 *                   createdAt: "2023-01-01T00:00:00.000Z"
 *                   likeCount: 4
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
 *       409:
 *         description: 아직 좋아요 처리되지 않은 게시글
 *         content:
 *          application/json:
 *           schema:
 *            type: object
 *            properties:
 *              message:
 *                type: string
 *                example: "아직 좋아요 처리되지 않은 게시글입니다."
 */
router.route("/:id/unlike").patch(authenticate, articleController.unlikeArticle);

/**
 * @swagger
 * /articles/{articleId}/comments:
 *   get:
 *     summary: 특정 게시글의 댓글 목록 조회
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: articleId
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

/**
 * @swagger
 * tags:
 *   name: Comments
 *   description: 댓글
 */

router
  .route("/:articleId/comments")
  .get(commentController.getCommentsByProductId)
  .post(authenticate, commentController.createComment);

/**
 * @swagger
 * /articles/{articleId}/comments/{commentId}:
 *   patch:
 *     summary: 댓글 수정
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
  .route("/:articleId/comments/:commentId")
  .patch(authenticate, commentController.updateComment)
  .delete(authenticate, commentController.deleteComment);

export default router;
