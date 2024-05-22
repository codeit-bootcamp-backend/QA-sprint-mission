import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function isFavorite(item) {
  const { id: userId } = item.ownerId;

  const { favoriteUser } = await prisma.product.findUnique({
    where: { id: item.id },
    select: { favoriteUser: true },
  });

  item.isFavorite = favoriteUser.some((user) => user.id === userId);

  return item;
}
