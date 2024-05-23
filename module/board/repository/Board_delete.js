import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function Board_delete(req, res) {
  const { id } = req.params;

  await prisma.board.delete({
    where: {
      id,
    },
  });

  res.sendStatus(204);
}
