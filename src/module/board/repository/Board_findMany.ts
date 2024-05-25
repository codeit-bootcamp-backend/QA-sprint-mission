import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

const prisma = new PrismaClient();

export async function Board_findMany(req: Request, res: Response) {
	const { offset = 0, limit = 10, order = 'recent', search = '' } = req.query;

	let orderBy:
		| { [key in 'createdAt']: 'desc' | 'asc' }
		| { [key in 'likeCount']: 'desc' | 'asc' };
	switch (order) {
		case 'recent':
			orderBy = { createdAt: 'desc' };
			break;
		case 'likes':
			orderBy = { likeCount: 'desc' };
			break;
		default:
			orderBy = { createdAt: 'desc' };
			break;
	}

	const boards = await prisma.board.findMany({
		where: {
			OR: [
				{
					title: {
						contains: search as string,
					},
				},
				{
					content: {
						contains: search as string,
					},
				},
			],
		},

		orderBy,
		skip: parseInt(offset as string),
		take: parseInt(limit as string),

		select: {
			id: true,
			title: true,
			content: true,
			imageUrl: true,
			createdAt: true,
			writer: true,
			likeCount: true,
			favoriteUser: true,
		},
	});

	res.send(boards);
}
