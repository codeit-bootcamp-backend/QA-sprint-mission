import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function Product_delete(req, res) {
  const { id } = req.params;

  await prisma.product.delete({
    where: {
      id,
    },
  });

  res.sendStatus(204);
}
