import { PrismaClient } from '@prisma/client';
import { assert } from 'superstruct';
import { Request, Response } from 'express';
import { CreateBoard } from '../board.structs';

const prisma = new PrismaClient();

export async function Board_create(req: Request, res: Response) {
	assert(req.body, CreateBoard);
	const { ...boardField } = req.body;

	const board = await prisma.board.create({
		data: {
			...boardField,
			likeCount: 0,
			writer: {
				connect: {
					email: req.cookies.email,
				},
			},
		},
	});

	res.send(board);
}
