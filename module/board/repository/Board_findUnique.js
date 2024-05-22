import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function Board_findUnique(req, res) {
  const { id } = req.params;

  const board = await prisma.board.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      content: true,
      imageUrl: true,
      createdAt: true,
      writer: true,
      favoriteUser: true,
    },
  });

  res.send(board);
}
