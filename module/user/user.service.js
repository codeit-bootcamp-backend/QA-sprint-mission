import { PrismaClient } from "@prisma/client";
import { assert } from "superstruct";
import { UpdateUser, UpdateUserPassword } from "./user.structs.js";
import { authChecker } from "../../helper/authChecker.js";
import pkg from "bcryptjs";

const prisma = new PrismaClient();

export async function getUser(req, res) {
  authChecker(req);

  const user = await prisma.user.findUnique({
    where: { email: req.email },
    include: { ownedProduct: true, favoriteProduct: true, ownedBoard: true, favoriteBoard: true },
  });

  res.send(user);
}

export async function updateUser(req, res) {
  authChecker(req);
  assert(req.body, UpdateUser);

  const updateUser = await prisma.user.update({
    where: { email: req.email },
    data: req.body,
    select: {
      id: true,
      nickname: true,
      image: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  res.send(updateUser);
}

export async function updateUserPassword(req, res) {
  authChecker(req);
  assert(req.body, UpdateUserPassword);

  const { genSalt, hash } = pkg;
  const { password } = req.body;

  // salt + hash
  const salt = await genSalt();
  const hashedPassword = await hash(password, salt);

  await prisma.user.update({
    where: { email: req.email },
    data: {
      password: hashedPassword,
    },
  });

  res.sendStatus(204);
}

export async function getUserOwnedProduct(req, res) {
  authChecker(req);

  const ownedProduct = await prisma.product.findMany({
    where: {
      ownerId: {
        // 여기는 1:N 관계라 some을 안 쓰고
        email: req.email,
      },
    },
  });

  res.send(ownedProduct);
}

export async function getUserFavoriteProduct(req, res) {
  authChecker(req);

  const favoriteProduct = await prisma.product.findMany({
    where: {
      favoriteUser: {
        // 여기는 M : N 관계라 some을 사용하나?
        some: { email: req.email },
      },
    },
  });

  res.send(favoriteProduct);
}

// export async function deleteUser(req, res) {
//   authChecker(req);

//   await prisma.user.delete({
//     where: {
//       email: req.email,
//     },
//   });

//   res.sendStatus(204);
// }
