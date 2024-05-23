export async function addIsFavorite(item, schema) {
  const { id: userId } = item.ownerId;

  const { favoriteUser } = await schema.findUnique({
    where: { id: item.id },
    select: { favoriteUser: true },
  });

  item.isFavorite = favoriteUser.some((user) => user.id === userId);

  return item;
}
