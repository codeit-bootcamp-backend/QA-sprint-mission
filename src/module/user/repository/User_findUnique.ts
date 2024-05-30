import { Request } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const User_findUnique = async (req: Request) => {
	const { email } = req.cookies;

	if (email) {
		const user = await prisma.user.findUnique({
			where: { email },
			include: {
				ownedProduct: true,
				favoriteProduct: true,
				ownedBoard: true,
				favoriteBoard: true,
			},
		});

		return user;
	} else {
		return null;
	}
};
