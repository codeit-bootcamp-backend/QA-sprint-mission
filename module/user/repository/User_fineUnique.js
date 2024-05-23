export async function getUser(req, res) {
  const { id } = req.params;

  const user = await prisma.user.findUnique({
    where: { id },
    include: { ownedProduct: true, favoriteProduct: true, ownedBoard: true, favoriteBoard: true },
  });

  res.send(user);
}
