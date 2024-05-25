import { assert } from 'superstruct';
import { CreateProduct } from '../products.structs';
import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

const prisma = new PrismaClient();

export async function Product_create(req: Request, res: Response) {
	assert(req.body, CreateProduct);
	const { ...productField } = req.body;

	const product = await prisma.product.create({
		data: {
			...productField,
			favoriteCount: 0,
			ownerId: {
				connect: {
					email: req.cookies.email,
				},
			},
		},
	});

	res.send(product);
}
