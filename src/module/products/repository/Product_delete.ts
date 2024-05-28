import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

const prisma = new PrismaClient();

export async function Product_delete(req: Request, res: Response) {
	const { id } = req.params;

	const product = await prisma.product.findUnique({
		where: { id },
		include: { ownerId: true },
	});

	// 내거인지 확인하는 로직
	try {
		if (product?.ownerId.email !== req.cookies.email) {
			return res
				.status(403)
				.send({ error: 'You are not authorized to delete this product' });
		}

		const response = await prisma.product.delete({
			where: { id },
		});

		res.status(200).send({ id: response.id });
	} catch (error) {
		res.status(500).send({ error: 'Error deleting product' });
	}
}
