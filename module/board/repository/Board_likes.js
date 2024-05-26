import { PrismaClient } from "@prisma/client";
import { isLiked } from "../../../helper/isLiked.js";

const prisma = new PrismaClient();

export async function Board_likes(req, res) {
  const { boardId } = req.body;

  if (isLiked(boardId, prisma.board)) {
    throw new Error("이미 좋아요를 누르셨어요");
  }

  await prisma.board.update({
    where: {
      id: boardId,
    },
    data: {
      favoriteUser: {
        connect: { email: req.email },
      },
      likeCount: {
        increment: 1,
      },
    },
  });

  res.sendStatus(204);
}
