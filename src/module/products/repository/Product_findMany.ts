import { PrismaClient } from '@prisma/client';
import { addIsFavorite } from '../../../helper/addIsFavorite';
import { Request, Response } from 'express';

const prisma = new PrismaClient();

export async function Product_findMany(req: Request, res: Response) {
	const {
		offset = '0',
		limit = '10',
		order = 'recent',
		search = '',
	} = req.query;

	let orderBy:
		| { [key in 'createdAt']: 'desc' | 'asc' }
		| { [key in 'favoriteCount']: 'desc' | 'asc' };
	switch (order) {
		case 'recent':
			orderBy = { createdAt: 'desc' };
			break;
		case 'favorite':
			orderBy = { favoriteCount: 'asc' };
			break;
		default:
			orderBy = { createdAt: 'desc' };
			break;
	}

	const products = await prisma.product.findMany({
		where: {
			OR: [
				{
					name: {
						contains: search as string,
					},
				},
				{
					description: {
						contains: search as string,
					},
				},
			],
		},

		orderBy: { ...orderBy },
		skip: parseInt(offset as string),
		take: parseInt(limit as string),

		select: {
			id: true,
			name: true,
			price: true,
			images: true,
			createdAt: true,
			ownerId: true,
			favoriteCount: true,
		},
	});

	const queries = products.map(async (item) => {
		return addIsFavorite(item);
	});

	const productWithIsFavorite = await Promise.all(queries);

	res.send(productWithIsFavorite);
}
