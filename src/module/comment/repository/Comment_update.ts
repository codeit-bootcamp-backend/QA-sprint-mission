import { PrismaClient } from '@prisma/client';
import { assert } from 'superstruct';
import { Request, Response } from 'express';
import { PatchComment } from '../comment.struct';

const prisma = new PrismaClient();

export async function Comment_update(req: Request, res: Response) {
	assert(req.body, PatchComment);
	const { id } = req.params;

	const comment = await prisma.comment.findUnique({
		where: { id },
		include: { writerId: true },
	});

	// 내거인지 확인하는 로직
	try {
		if (comment?.writerId.email !== req.cookies.email) {
			return res
				.status(403)
				.send({ error: 'You are not authorized to delete this comment' });
		}

		const updateComment = await prisma.comment.update({
			where: {
				id,
			},

			data: req.body,
		});

		res.send(updateComment);
	} catch (error) {
		res.status(500).send({ error: 'Error deleting comment' });
	}
}
