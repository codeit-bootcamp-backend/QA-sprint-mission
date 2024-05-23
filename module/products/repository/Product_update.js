import { PrismaClient } from "@prisma/client";
import { assert } from "superstruct";
import { PatchProduct } from "../products.structs.js";

const prisma = new PrismaClient();

export async function Product_update(req, res) {
  assert(req.body, PatchProduct);

  const { id } = req.params;
  const product = await prisma.product.update({
    where: {
      id,
    },

    data: req.body,
  });

  res.send(product);
}
