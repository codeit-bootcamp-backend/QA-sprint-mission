import { PrismaClient } from "@prisma/client";
import { assert } from "superstruct";
import { PatchProduct } from "../products.structs.js";

const prisma = new PrismaClient();

export async function Product_update(req, res) {
  assert(req.body, PatchProduct);
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

    const updateProduct = await prisma.product.update({
      where: {
        id,
      },

      data: req.body,
    });

    res.send(updateProduct);
  } catch (error) {
    res.status(500).send({ error: "Error deleting product" });
  }
}
