import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function isFavorite(
	findId: string,
	user: { [key in 'id']: string } | null,
) {
	if (user === null) {
		return false;
	} else {
		const dbResponse = await prisma.product.findUnique({
			where: { id: findId },
			include: {
				favoriteUser: true,
			},
		});

		const like = dbResponse!.favoriteUser.some(
			(favoriteU) => favoriteU.id === user.id,
		);

		return like;
	}
}
