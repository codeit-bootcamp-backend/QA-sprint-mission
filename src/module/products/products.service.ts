import { Request, Response } from 'express';
import { Product_findUnique } from './repository/Product_findUnique';
import { Product_delete } from './repository/Product_delete';
import { Product_update } from './repository/Product_update';
import { Product_create } from './repository/Product_create';
import { Product_findMany } from './repository/Product_findMany';
import { Product_likes } from './repository/Product_likes';
import { Product_dislikes } from './repository/Product_dislikes';
import { Comment_create_onProduct } from '../comment/repository/Comment_create';
import { Comment_findMany_onProduct } from '../comment/repository/Comment_findMany';
import { authChecker } from '../../helper/authChecker';

export function getProductList(req: Request, res: Response) {
	Product_findMany(req, res);
}

export function getProduct(req: Request, res: Response) {
	Product_findUnique(req, res);
}

export function createProduct(req: Request, res: Response) {
	authChecker(req);
	Product_create(req, res);
}

export function updateProduct(req: Request, res: Response) {
	authChecker(req);
	Product_update(req, res);
}

export function deleteProduct(req: Request, res: Response) {
	authChecker(req);
	Product_delete(req, res);
}

export function likeProduct(req: Request, res: Response) {
	authChecker(req);
	Product_likes(req, res);
}

export function dislikeProduct(req: Request, res: Response) {
	authChecker(req);
	Product_dislikes(req, res);
}

export function createComment(req: Request, res: Response) {
	authChecker(req);
	Comment_create_onProduct(req, res);
}

export function getCommentList(req: Request, res: Response) {
	Comment_findMany_onProduct(req, res);
}
