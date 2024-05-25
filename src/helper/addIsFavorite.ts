import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function addIsFavorite(item: {
	ownerId: { id: string };
	id: string;
	isFavorite?: boolean;
}) {
	const { id: userId } = item.ownerId;

	const favoriteUser = await prisma.product.findUnique({
		where: { id: item.id },
		select: { favoriteUser: true },
	});

	item.isFavorite = favoriteUser!.favoriteUser.some(
		(user) => user.id === userId,
	);

	return item;
}

export async function addIsLiked() {}
