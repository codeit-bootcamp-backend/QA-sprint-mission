import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function isLiked(findId: string) {
	// 좋아요를 했는지 안 했는지 확인하기 위해 제품 찾아오기
	const dbResponse = await prisma.board.findUnique({
		where: { id: findId },
		include: {
			favoriteUser: true,
		},
	});

	const isLike = dbResponse!.favoriteUser.some((user) => user.id === findId);

	return isLike;
}

export async function isFavorite(findId: string) {
	// 좋아요를 했는지 안 했는지 확인하기 위해 제품 찾아오기
	const dbResponse = await prisma.product.findUnique({
		where: { id: findId },
		include: {
			favoriteUser: true,
		},
	});

	const favorite = dbResponse!.favoriteUser.some((user) => user.id === findId);

	return favorite;
}
