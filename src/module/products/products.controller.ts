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
 *   get:
 *     tags:
 *     - products
 *     parameters:
 *       - in: query
 *         name: page
 *         description: 페이지 번호
 *         default: 1
 *         schema:
 *           type: number
 *           format: double
 *       - in: query
 *         name: pageSize
 *         description: 페이지 당 상품 수
 *         default: 10
 *         schema:
 *           type: number
 *           format: double
 *       - in: query
 *         name: orderBy
 *         schema:
 *           type: string
 *           enum: [favorite, recent]
 *         description: 정렬 기준
 *         default: recent
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *         description: 검색 키워드
 *     responses:
 *       200:
 *         description: Ok
 *         content:
 *           application/json:
 *             example:
 *               totalCount: 0
 *               list:
 *               - id: 1
 *                 name: "상품 이름"
 *                 price: 0
 *                 description: "string"
 *                 tags:
 *                 - "전자제품"
 *                 images:
 *                 - "https://example.com/..."
 *                 ownerId: 1
 *                 favoriteCount: 0
 *                 createdAt: "2024-05-27T10:13:03.625Z"
 */

productRoutes
	.route('/')
	.get(asyncHandler(getProductList))
	.post(asyncHandler(createProduct));

productRoutes
	.route('/:id')
	.get(asyncHandler(getProduct))
	.patch(asyncHandler(updateProduct))
	.delete(asyncHandler(deleteProduct));

productRoutes
	.route('/:id/comments')
	.post(asyncHandler(createComment))
	.get(asyncHandler(getCommentList));

productRoutes
	.route('/:id/like')
	.post(asyncHandler(likeProduct))
	.delete(asyncHandler(dislikeProduct));

export default productRoutes;
