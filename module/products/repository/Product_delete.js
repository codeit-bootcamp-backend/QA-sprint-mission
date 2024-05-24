import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function Product_delete(req, res) {
  // 내거인지 확인하는 로직 필요
  const { id } = req.params;

  await prisma.board.delete({
    where: {
      id,
    },
  });

  res.sendStatus(204);
}
