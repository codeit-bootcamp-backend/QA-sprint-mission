import { Prisma } from '@prisma/client';
import { Request, Response } from 'express';

export function asyncHandler(handler: (req: Request, res: Response) => void) {
	return async function (req: Request, res: Response) {
		try {
			await handler(req, res);
		} catch (e) {
			if (
				e.name === 'StructError' ||
				e instanceof Prisma.PrismaClientValidationError
			) {
				res.status(400).send({ message: e.message });
			} else if (
				e instanceof Prisma.PrismaClientKnownRequestError &&
				e.code === 'P2025'
			) {
				res.sendStatus(404);
			} else if (e) {
				res.status(401).send({ message: e.message });
			} else {
				res.status(500).send({ message: e.message });
			}
		}
	};
}
