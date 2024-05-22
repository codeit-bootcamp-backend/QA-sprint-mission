import { PrismaClient } from "@prisma/client";
import { assert } from "superstruct";
import { CreateProduct, PatchProduct } from "./products.structs.js";

const prisma = new PrismaClient();

export async function getProductList(req, res) {
  const { offset = 0, limit = 10, order = "recent", search = "" } = req.query;

  let orderBy;
  switch (order) {
    case "recent":
      orderBy = { createdAt: "desc" };
      break;
    case "favorite":
      orderBy = { favoriteCount: "asc" };
      break;
    default:
      orderBy = { createdAt: "desc" };
      break;
  }

  const products = await prisma.product.findMany({
    where: {
      OR: [
        {
          name: {
            contains: search,
          },
        },
        {
          description: {
            contains: search,
          },
        },
      ],
    },

    orderBy,
    skip: parseInt(offset),
    take: parseInt(limit),

    select: {
      id: true,
      name: true,
      price: true,
      images: true,
      createdAt: true,
      ownerId: true,
    },
  });

  const queries = products.map(async (item) => {
    const { id: userId } = item.ownerId;
    const { favoriteUser } = await prisma.product.findUnique({
      where: { id: item.id },
      select: { favoriteUser: true },
    });

    item.favoriteCount = favoriteUser.length;
    item.isFavorite = favoriteUser.some((user) => user.id === userId);
  });

  await Promise.all(queries);

  res.send(products);
}

export async function getProduct(req, res) {
  const { id } = req.params;

  const product = await prisma.product.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      description: true,
      price: true,
      tags: true,
      images: true,
      createdAt: true,
      ownerID: true,
    },
  });

  res.send(product);
}

export async function createProduct(req, res) {
  assert(req.body, CreateProduct);
  const { ownerId, ...productField } = req.body;

  prisma.product.create({
    data: {
      ...productField,
      ownerId: {
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

export async function deleteProduct(req, res) {
  const { id } = req.params;

  await prisma.product.delete({
    where: {
      id,
    },
  });

  res.sendStatus(204);
}
