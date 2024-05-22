import { PrismaClient } from "@prisma/client";
import { OwnerId } from "./user.structs.js";
import { assert } from "superstruct";

const prisma = new PrismaClient();
export async function getUserList(req, res) {
  const users = await prisma.user.findMany({
    include: {
      favoriteProduct: true,
    },
  });

  res.send(users);
}
export async function getUser(req, res) {
  const { id } = req.params;

  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      favoriteProduct: true,
    },
  });

  res.send(user);
}

export async function productLike(req, res) {
  assert(req.body, OwnerId);

  const { id } = req.params;
  const { productId } = req.body;

  await prisma.user.update({
    where: {
      id,
    },
    data: {
      favoriteProduct: {
        connect: { id: productId },
      },
    },
  });

  res.sendStatus(204);
}
