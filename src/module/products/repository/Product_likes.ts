import { PrismaClient } from '@prisma/client';
import { isFavorite } from '../../../helper/isLiked';
import { Request, Response } from 'express';

const prisma = new PrismaClient();

export async function Product_likes(req: Request, res: Response) {
	const { productId } = req.body;

	// 액션에 따른 에러 핸들
	if (await isFavorite(productId)) {
		throw new Error('이미 좋아요를 누르셨어요');
	}

	await prisma.product.update({
		where: {
			id: productId,
		},
		data: {
			favoriteUser: {
				connect: { email: req.cookies.email },
			},
			favoriteCount: {
				increment: 1,
			},
		},
	});

	res.sendStatus(204);
}
