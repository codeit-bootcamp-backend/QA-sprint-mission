import { PrismaClient } from "@prisma/client";
import { assert } from "superstruct";
import { CreateUser } from "./user.structs.js";

const prisma = new PrismaClient();

export async function getUserList(req, res) {
  const users = await prisma.user.findMany({
    include: { ownedProduct: true, favoriteProduct: true, ownedBoard: true, favoriteBoard: true },
  });

  res.send(users);
}

export async function getUser(req, res) {
  const { id } = req.params;

  const user = await prisma.user.findUnique({
    where: { id },
    include: { ownedProduct: true, favoriteProduct: true, ownedBoard: true, favoriteBoard: true },
  });

  res.send(user);
}

export async function createUser(req, res) {
  assert(req.body, CreateUser);

  const user = await prisma.user.create({
    data: req.body,
  });

  res.send(user);
}

export async function deleteUser(req, res) {
  const { id } = req.params;

  await prisma.user.delete({
    where: {
      id,
    },
  });

  res.sendStatus(204);
}
