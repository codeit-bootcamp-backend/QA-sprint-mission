import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import { isLiked } from '../../../helper/isLiked';
import { User_findUnique } from '../../user/repository/User_findUnique';

const prisma = new PrismaClient();

export async function Board_likes(req: Request, res: Response) {
	const { boardId } = req.body;

	const user = await User_findUnique(req);

	if (await isLiked(boardId, user)) {
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
