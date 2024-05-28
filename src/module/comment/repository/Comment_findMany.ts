import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

const prisma = new PrismaClient();

export async function Comment_findMany_onBoard(req: Request, res: Response) {
	const { cursor, limit } = req.query;

	const takeNumber = limit ? parseInt(limit as string, 10) : 10;

	const comments = await prisma.comment.findMany({
		orderBy: { createdAt: 'desc' },
		cursor: cursor ? { id: cursor as string } : undefined,
		take: takeNumber,

		select: {
			id: true,
			content: true,
			createdAt: true,
			updatedAt: true,
			writerId: {
				select: {
					id: true,
					image: true,
					nickname: true,
				},
			},
		},
	});

	let nextCursor = '';
	if (comments.length === takeNumber) {
		const nextComment = comments.pop();

		const isNextExist = await prisma.comment.findMany({
			orderBy: { createdAt: 'desc' },
			cursor: { id: nextComment!.id },
			take: 1,
		});

		if (isNextExist.length) {
			nextCursor = nextComment!.id;
		}
	}

	res.send({
		nextCursor,
		list: comments,
	});
}

export async function Comment_findMany_onProduct(req: Request, res: Response) {
	const { cursor, limit } = req.query;

	const takeNumber = limit ? parseInt(limit as string, 10) : 10;

	const comments = await prisma.comment.findMany({
		orderBy: { createdAt: 'desc' },
		cursor: cursor ? { id: cursor as string } : undefined,
		take: takeNumber,

		select: {
			id: true,
			content: true,
			createdAt: true,
			updatedAt: true,
			writerId: {
				select: {
					id: true,
					image: true,
					nickname: true,
				},
			},
		},
	});

	let nextCursor = '';
	if (comments.length === takeNumber) {
		const nextComment = comments.pop();

		const isNextExist = await prisma.comment.findMany({
			orderBy: { createdAt: 'desc' },
			cursor: { id: nextComment!.id },
			take: 1,
		});

		if (isNextExist.length) {
			nextCursor = nextComment!.id;
		}
	}

	res.send({
		nextCursor,
		list: comments,
	});
}
