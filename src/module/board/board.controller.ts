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
 *             $ref: '#/components/schemas/ProductBaseRequest'
 *     responses:
 *       200:
 *         description: Ok
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductBaseResponse'
 *   get:
 *     tags:
 *     - products
 *     description: 상품 목록 조회
 *     parameters:
 *       - $ref: '#/components/schemas/SearchProductsPageQuery'
 *       - $ref: '#/components/schemas/SearchProductPageSizeQuery'
 *       - $ref: '#/components/schemas/SearchProductOrderByQuery'
 *       - $ref: '#/components/schemas/SearchProductKeywordQuery'
 *     responses:
 *       200:
 *         description: Ok
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SearchProductAll'
 */

boardRoutes
	.route('/')
	.get(asyncHandler(getBoardList))
	.post(asyncHandler(createBoard));
boardRoutes.route('/comment');

boardRoutes
	.route('/:id')
	.get(asyncHandler(getBoard))
	.delete(asyncHandler(deleteBoard))
	.patch(asyncHandler(updateBoard));

boardRoutes
	.route('/:id/comments')
	.post(asyncHandler(createComment))
	.get(asyncHandler(getCommentList));
boardRoutes
	.route('/:id/like')
	.post(asyncHandler(likeBoard))
	.delete(asyncHandler(dislikeBoard));

export default boardRoutes;
