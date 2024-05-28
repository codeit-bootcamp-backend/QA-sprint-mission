import { Router } from 'express';
import {
	createComment,
	createProduct,
	deleteProduct,
	dislikeProduct,
	getCommentList,
	getProduct,
	getProductList,
	likeProduct,
	updateProduct,
} from './products.service';
import { asyncHandler } from '../asyncHandler';

const productRoutes = Router();

/**
 * @openapi
 * '/products':
 *   post:
 *     tags:
 *     - products
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
 *       - $ref: '#/components/schemas/SearchPageQuery'
 *       - $ref: '#/components/schemas/SearchPageSizeQuery'
 *       - $ref: '#/components/schemas/SearchProductsOrderByQuery'
 *       - $ref: '#/components/schemas/SearchKeywordQuery'
 *     responses:
 *       200:
 *         description: Ok
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SearchProductAll'
 */

productRoutes
	.route('/')
	.get(asyncHandler(getProductList))
	.post(asyncHandler(createProduct));

/**
 * @openapi
 * '/products/{productId}':
 *   get:
 *     tags:
 *     - products
 *     parameters:
 *       - $ref: '#/components/schemas/SearchProductProductIdPath'
 *     responses:
 *       200:
 *         description: Ok
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SearchProductSome'
 *       404:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessage'
 *   patch:
 *     tags:
 *     - products
 *     parameters:
 *       - $ref: '#/components/schemas/SearchProductProductIdPath'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductBaseRequest'
 *     responses:
 *       200:
 *         description: Ok
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SearchProductSome'
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
 *     - products
 *     description: 상품 삭제
 *     parameters:
 *       - $ref: '#/components/schemas/SearchProductProductIdPath'
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

productRoutes
	.route('/:id')
	.get(asyncHandler(getProduct))
	.patch(asyncHandler(updateProduct))
	.delete(asyncHandler(deleteProduct));

/**
 * @openapi
 * '/product/{product}/comments':
 *   post:
 *     tags:
 *     - comment
 *     parameters:
 *       - $ref: '#/components/schemas/SearchProductProductIdPath'
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
 *     parameters:
 *       - $ref: '#/components/schemas/SearchProductProductIdPath'
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

productRoutes
	.route('/:id/comments')
	.post(asyncHandler(createComment))
	.get(asyncHandler(getCommentList));

/**
 * @openapi
 * '/products/{productId}/favorite':
 *   post:
 *     tags:
 *     - products
 *     parameters:
 *       - $ref: '#/components/schemas/SearchProductProductIdPath'
 *     responses:
 *       200:
 *         description: Ok
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SearchProductSome'
 *       404:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessage'
 *
 *   delete:
 *     tags:
 *     - products
 *     parameters:
 *       - $ref: '#/components/schemas/SearchProductProductIdPath'
 *     responses:
 *       200:
 *         description: Ok
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SearchProductSome'
 *       404:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessage'
 *
 */

productRoutes
	.route('/:id/favorite')
	.post(asyncHandler(likeProduct))
	.delete(asyncHandler(dislikeProduct));

export default productRoutes;
