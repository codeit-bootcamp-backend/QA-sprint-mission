import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function isLiked(
	findId: string,
	user: { [key in 'id']: string } | null,
) {
	// 좋아요를 했는지 안 했는지 확인하기 위해 제품 찾아오기

	if (user === null) {
		return false;
	} else {
		const dbResponse = await prisma.board.findUnique({
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
