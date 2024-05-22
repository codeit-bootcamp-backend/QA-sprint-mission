import { assert } from "superstruct";
import { CreateProduct } from "../products.structs.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function Product_create(req, res) {
  assert(req.body, CreateProduct);
  const { ownerId, ...productField } = req.body;

  const product = await prisma.product.create({
    data: {
      ...productField,
      favoriteCount: 0,
      ownerId: {
        connect: {
          id: ownerId,
        },
      },
    },
  });

  res.send(product);
}
