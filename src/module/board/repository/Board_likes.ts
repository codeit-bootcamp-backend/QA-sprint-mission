import { PrismaClient } from '@prisma/client';
import { isLiked } from '../../../helper/isLiked';
import { Request, Response } from 'express';

const prisma = new PrismaClient();

export async function Board_likes(req: Request, res: Response) {
	const { boardId } = req.body;

	if (await isLiked(boardId)) {
		throw new Error('이미 좋아요를 누르셨어요');
	}

	await prisma.board.update({
		where: {
			id: boardId,
		},
		data: {
			favoriteUser: {
				connect: { email: req.cookies.email },
			},
			likeCount: {
				increment: 1,
			},
		},
	});

	res.sendStatus(204);
}
