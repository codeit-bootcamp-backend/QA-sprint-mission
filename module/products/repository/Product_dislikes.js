import { PrismaClient } from "@prisma/client";
import { isLiked } from "../../../helper/isLiked.js";

const prisma = new PrismaClient();

export async function Product_dislikes(req, res) {
  const { productId } = req.body;

  // 액션에 따른 에러 핸들
  if (!isLiked(productId, prisma.product)) {
    throw new Error("이미 좋아요가 해제되었어요");
  }

  await prisma.product.update({
    where: {
      id: productId,
    },
    data: {
      favoriteUser: {
        disconnect: { email: req.email },
      },
      favoriteCount: {
        decrement: 1,
      },
    },
  });

  res.sendStatus(204);
}
