import { Prisma } from '@prisma/client';
import { Request, Response } from 'express';
import { CustomError } from '../helper/CustomError';

export function asyncHandler(handler: (req: Request, res: Response) => void) {
	return async function (req: Request, res: Response) {
		try {
			await handler(req, res);
		} catch (e: any) {
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
			} else if (e instanceof CustomError && e.code === 'CE_Unauthorized') {
				res.status(401).send({ message: e.message });
			} else {
				res.status(500).send({ message: e.message });
			}
		}
	};
}
