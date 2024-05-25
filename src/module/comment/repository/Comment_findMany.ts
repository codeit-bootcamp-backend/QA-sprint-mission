import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

const prisma = new PrismaClient();

export async function Comment_findMany_onBoard(req: Request, res: Response) {
	const { id } = req.params;
	const { offset = 0, limit = 10, order = 'recent' } = req.query;

	let orderBy: { [key in 'createdAt']: 'desc' | 'asc' };
	switch (order) {
		case 'recent':
			orderBy = { createdAt: 'desc' };
			break;
		default:
			orderBy = { createdAt: 'asc' };
			break;
	}

	const comment = await prisma.comment.findMany({
		where: { id },

		orderBy,
		skip: parseInt(offset as string),
		take: parseInt(limit as string),

		select: {
			id: true,
			content: true,
			createdAt: true,
			writerId: true,
		},
	});

	res.send(comment);
}

export async function Comment_findMany_onProduct(req: Request, res: Response) {
	const { id } = req.params;
	const { offset = 0, limit = 10, order = 'recent' } = req.query;

	let orderBy: { [key in 'createdAt']: 'desc' | 'asc' };
	switch (order) {
		case 'recent':
			orderBy = { createdAt: 'desc' };
			break;
		default:
			orderBy = { createdAt: 'asc' };
			break;
	}

	const comment = await prisma.comment.findMany({
		where: { id },

		orderBy,
		skip: parseInt(offset as string),
		take: parseInt(limit as string),

		select: {
			id: true,
			content: true,
			createdAt: true,
			writerId: true,
		},
	});

	res.send(comment);
}
