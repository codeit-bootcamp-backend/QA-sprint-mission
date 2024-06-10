import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

const prisma = new PrismaClient();

export async function Board_delete(req: Request, res: Response) {
	const { id } = req.params;

	const board = await prisma.board.findUnique({
		where: { id },
		include: { writer: true },
	});

	try {
		if (board?.writer.email !== req.cookies.email) {
			return res
				.status(403)
				.send({ error: 'You are not authorized to delete this product' });
		}

		await prisma.board.delete({
			where: { id },
		});

		res.sendStatus(204);
	} catch (error) {
		res.status(500).send({ error: 'Error deleting product' });
	}
}
