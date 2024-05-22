import { PrismaClient } from "@prisma/client";
import { assert } from "superstruct";
import { ToggleProductLike } from "./user.structs.js";

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

export async function toggleProductLike(req, res) {
  // assert(req.body, ToggleProductLike);

  const { id: userId } = req.params;
  const { productId, action } = req.body;

  // 좋아요를 했는지 안 했는지 확인하기 위해 제품 찾아오기
  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: {
      favoriteUser: true,
    },
  });

  const isLiked = product.favoriteUser.some((user) => user.id === userId);

  // 액션에 따른 에러 핸들
  if (isLiked && action === "like") {
    throw new Error("이미 좋아요를 누르셨어요");
  } else if (!isLiked && action === "dislike") {
    throw new Error("이미 좋아요가 해제되었어요");
  }

  if (action === "like") {
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        favoriteProduct: {
          connect: { id: productId },
        },
      },
    });
  } else {
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        favoriteProduct: {
          disconnect: { id: productId },
        },
      },
    });
  }

  res.sendStatus(204);
}
