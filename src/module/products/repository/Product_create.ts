import { assert } from 'superstruct';
import { CreateProduct } from '../products.structs';
import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import { ownerIdFormatter } from '../../../helper/ownerIdFormatter';

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
		select: {
			createdAt: true,
			favoriteCount: true,
			ownerId: {
				select: {
					id: true,
				},
			},
			images: true,
			tags: true,
			price: true,
			description: true,
			name: true,
			id: true,
		},
	});

	const response = ownerIdFormatter(product);

	res.send(response);
}
