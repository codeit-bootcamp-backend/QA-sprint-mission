import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function Board_delete(req, res) {
  const { id } = req.params;

  const board = await prisma.board.findUnique({
    where: { id },
    include: { writer: true },
  });

  try {
    if (board.writer.email !== req.email) {
      return res.status(403).send({ error: "You are not authorized to delete this product" });
    }

    await prisma.board.delete({
      where: { id },
    });

    res.sendStatus(204);
  } catch (error) {
    res.status(500).send({ error: "Error deleting product" });
  }
}
