import { PrismaClient } from "@prisma/client";
import { isLiked } from "../../../helper/isLiked.js";

const prisma = new PrismaClient();

export async function Board_dislikes(req, res) {
  const { boardId } = req.body;

  // 액션에 따른 에러 핸들
  if (!isLiked(boardId, prisma.board)) {
    throw new Error("이미 좋아요가 해제되었어요");
  }

  await prisma.board.update({
    where: {
      id: boardId,
    },
    data: {
      favoriteUser: {
        disconnect: { email: req.email },
      },
      likeCount: {
        decrement: 1,
      },
    },
  });

  res.sendStatus(204);
}
