import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function Product_delete(req, res) {
  const { id } = req.params;

  const product = await prisma.product.findUnique({
    where: { id },
    include: { ownerId: true },
  });

  // 내거인지 확인하는 로직
  try {
    if (product.ownerId.email !== req.email) {
      return res.status(403).send({ error: "You are not authorized to delete this product" });
    }

    await prisma.product.delete({
      where: { id },
    });

    res.sendStatus(204);
  } catch (error) {
    res.status(500).send({ error: "Error deleting product" });
  }
}
