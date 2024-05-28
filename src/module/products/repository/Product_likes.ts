import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import { isFavorite } from '../../../helper/isFavorite';
import { User_findUnique } from '../../user/repository/User_findUnique';

const prisma = new PrismaClient();

export async function Product_likes(req: Request, res: Response) {
	const { id } = req.params;

	const user = await User_findUnique(req);

	// 액션에 따른 에러 핸들
	if (await isFavorite(id, user)) {
		throw new Error('이미 좋아요를 누르셨어요');
	}

	await prisma.product.update({
		where: {
			id,
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
