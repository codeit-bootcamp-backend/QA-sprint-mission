import { assert } from 'superstruct';
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { CreateComment } from '../comment.struct';

const prisma = new PrismaClient();

export async function Comment_create_onProduct(req: Request, res: Response) {
	assert(req.body, CreateComment);
	const { id: productId } = req.params;
	const { ...commentField } = req.body;

	const comment = await prisma.comment.create({
		data: {
			...commentField,
			writerId: { connect: { email: req.cookies.email } },
			productId: { connect: { id: productId } },
		},
	});

	res.send(comment);
}

export async function Comment_create_onBoard(req: Request, res: Response) {
	assert(req.body, CreateComment);
	const { id: BoardId } = req.params;
	const { ...commentField } = req.body;

	const comment = await prisma.comment.create({
		data: {
			...commentField,
			writerId: { connect: { email: req.cookies.email } },
			boardId: { connect: { id: BoardId } },
		},
	});

	res.send(comment);
}
