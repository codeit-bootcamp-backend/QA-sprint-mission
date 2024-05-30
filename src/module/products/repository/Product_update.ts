import { PrismaClient } from '@prisma/client';
import { assert } from 'superstruct';
import { PatchProduct } from '../products.structs';
import { Request, Response } from 'express';
import { ExtWebSocket, wss } from '../../../app';

const prisma = new PrismaClient();

export async function Product_update(req: Request, res: Response) {
	assert(req.body, PatchProduct);
	const { id } = req.params;

	const product = await prisma.product.findUnique({
		where: { id },
		select: {
			name: true,
			price: true,
			ownerId: true,
			favoriteUser: true,
		},
	});

	// 내거인지 확인하는 로직
	try {
		if (product?.ownerId.email !== req.cookies.email) {
			return res
				.status(403)
				.send({ error: 'You are not authorized to delete this product' });
		}
		//
		const updateProduct = await prisma.product.update({
			where: {
				id,
			},
			data: req.body,
		});

		// 업데이트가 되었으면 지금 클라이언트에 접속해있는 사람들 중에 가격 바뀐 거 알고 싶은 사람은 알림 보내기

		wss.clients.forEach((client: ExtWebSocket) => {
			product?.favoriteUser.forEach((user) => {
				if (
					client.userEmail === user.email &&
					product.price !== updateProduct.price
				) {
					client.send(
						JSON.stringify({
							type: 'updateProduct',
							payload: `${product.name} 제품의 금액이 변경되었습니다. 지금 바로 확인해보세요!`,
						}),
					);
				}
			});
		});

		res.send(updateProduct);
	} catch (error) {
		res.status(500).send({ error: 'Error deleting product' });
	}
}
