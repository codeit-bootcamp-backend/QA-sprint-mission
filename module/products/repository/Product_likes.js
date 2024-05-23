import { PrismaClient } from "@prisma/client";
import { isLiked } from "../../../helper/isLiked.js";

const prisma = new PrismaClient();

export async function Product_likes(req, res) {
  const { id: userId } = req.params;
  const { productId } = req.body;

  // 액션에 따른 에러 핸들
  if (isLiked(productId, prisma.product)) {
    throw new Error("이미 좋아요를 누르셨어요");
  }

  await prisma.product.update({
    where: {
      id: productId,
    },
    data: {
      favoriteUser: {
        connect: { id: userId },
      },
      favoriteCount: {
        increment: 1,
      },
    },
  });

  res.sendStatus(204);
}
