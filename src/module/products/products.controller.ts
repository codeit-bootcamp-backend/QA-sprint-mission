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
