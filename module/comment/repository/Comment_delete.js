import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function Comment_delete(req, res) {
  const { id } = req.params;

  await prisma.comment.delete({
    where: {
      id,
    },
  });

  res.sendStatus(204);
}
