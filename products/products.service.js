import { PrismaClient } from "@prisma/client";
import { assert } from "superstruct";
import { CreateProduct, PatchProduct } from "./products.structs.js";

const prisma = new PrismaClient();

export async function getProductList(req, res) {
  const products = await prisma.product.findMany();

  res.send(products);
}

export async function getProduct(req, res) {
  const { id } = req.params;

  const product = await prisma.product.findUnique({
    where: { id },
  });

  res.send(product);
}

export async function createProduct(req, res) {
  assert(req.body, CreateProduct);
  const { ownerId, ...productField } = req.body;

  const product = await prisma.product.create({
    data: {
      ...productField,
      userId: {
        connect: {
          id: ownerId,
        },
      },
    },
  });

  res.send(product);
}

export async function updateProduct(req, res) {
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

export async function productLike(req, res) {}

export async function deleteProduct(req, res) {
  const { id } = req.params;

  await prisma.product.delete({
    where: {
      id,
    },
  });

  res.sendStatus(204);
}
