import { Request, Response } from 'express';
import { User_findUnique } from '../../user/repository/User_findUnique';
import { PrismaClient } from '@prisma/client';
import { isLiked } from '../../../helper/isLiked';

const prisma = new PrismaClient();

export async function Board_dislikes(req: Request, res: Response) {
	const { boardId } = req.params;

	const user = await User_findUnique(req);

	// 액션에 따른 에러 핸들
	if (!(await isLiked(boardId, user))) {
		throw new Error('이미 좋아요가 해제되었어요');
	}

	await prisma.board.update({
		where: {
			id: boardId,
		},
		data: {
			favoriteUser: {
				disconnect: { email: req.cookies.email },
			},
			likeCount: {
				decrement: 1,
			},
		},
	});

	res.sendStatus(204);
}
