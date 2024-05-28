import { Router } from 'express';

import { asyncHandler } from '../asyncHandler';
import {
	createBoard,
	createComment,
	deleteBoard,
	dislikeBoard,
	getBoard,
	getBoardList,
	getCommentList,
	likeBoard,
	updateBoard,
} from './board.service';

const boardRoutes = Router();

/**
 * @openapi
 * '/boards':
 *   post:
 *     tags:
 *     - boards
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BoardBaseRequest'
 *     responses:
 *       200:
 *         description: Ok
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BoardBaseResponse'
 *   get:
 *     tags:
 *     - boards
 *     description: 상품 목록 조회
 *     parameters:
 *       - $ref: '#/components/schemas/SearchPageQuery'
 *       - $ref: '#/components/schemas/SearchPageSizeQuery'
 *       - $ref: '#/components/schemas/SearchBoardsOrderByQuery'
 *       - $ref: '#/components/schemas/SearchKeywordQuery'
 *     responses:
 *       200:
 *         description: Ok
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SearchBoardAll'
 */

boardRoutes
	.route('/')
	.get(asyncHandler(getBoardList))
	.post(asyncHandler(createBoard));
boardRoutes.route('/comment');

/**
 * @openapi
 * '/boards/{boardId}':
 *   get:
 *     tags:
 *     - boards
 *     parameters:
 *       - $ref: '#/components/schemas/SearchBoardBoardIdPath'
 *     responses:
 *       200:
 *         description: Ok
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BoardBaseResponse'
 *       404:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessage'
 *   patch:
 *     tags:
 *     - boards
 *     parameters:
 *       - $ref: '#/components/schemas/SearchBoardBoardIdPath'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *             schema:
 *               $ref: '#/components/schemas/BoardBaseRequest'
 *     responses:
 *       200:
 *         description: Ok
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SearchBoardSome'
 *               isFavorites:
 *                 type: boolean
 *       403:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessage'
 *       404:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessage'
 *   delete:
 *     tags:
 *     - boards
 *     description: 상품 삭제
 *     parameters:
 *       - $ref: '#/components/schemas/SearchBoardBoardIdPath'
 *     responses:
 *       200:
 *         description: Ok
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                  $ref: '#/components/schemas/Uuid'
 *       403:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessage'
 *       404:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessage'
 */
boardRoutes
	.route('/:id')
	.get(asyncHandler(getBoard))
	.delete(asyncHandler(deleteBoard))
	.patch(asyncHandler(updateBoard));

/**
 * @openapi
 * '/boards/{boardId}/comments':
 *   post:
 *     tags:
 *     - comment
 *     description: 게시글의 댓글 작성
 *     parameters:
 *       - $ref: '#/components/schemas/SearchBoardBoardIdPath'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *             schema:
 *               $ref: '#/components/schemas/CommentBaseRequest'
 *     responses:
 *       200:
 *         description: Ok
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CommentBaseResponse'
 *       404:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessage'
 *   get:
 *     tags:
 *     - comment
 *     description: 게시글의 댓글 목록 조회
 *     parameters:
 *       - $ref: '#/components/schemas/SearchBoardBoardIdPath'
 *       - $ref: '#/components/schemas/SearchCommentsLimitQuery'
 *       - $ref: '#/components/schemas/SearchCommentsCursorQuery'
 *     responses:
 *       200:
 *         description: Ok
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SearchCommentAll'
 *       404:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessage'
 *
 */

boardRoutes
	.route('/:id/comments')
	.post(asyncHandler(createComment))
	.get(asyncHandler(getCommentList));

/**
 * @openapi
 * '/boards/{boardId}/like':
 *   post:
 *     tags:
 *     - boards
 *     parameters:
 *       - $ref: '#/components/schemas/SearchBoardBoardIdPath'
 *     responses:
 *       200:
 *         description: Ok
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SearchBoardSome'
 *       404:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessage'
 *
 *   delete:
 *     tags:
 *     - boards
 *     parameters:
 *       - $ref: '#/components/schemas/SearchBoardBoardIdPath'
 *     responses:
 *       200:
 *         description: Ok
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SearchBoardSome'
 *       404:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessage'
 *
 */

boardRoutes
	.route('/:id/like')
	.post(asyncHandler(likeBoard))
	.delete(asyncHandler(dislikeBoard));

export default boardRoutes;
