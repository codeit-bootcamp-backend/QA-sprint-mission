import { PrismaClient } from "@prisma/client";
import { assert } from "superstruct";
import { PatchBoard } from "../board.structs.js";

const prisma = new PrismaClient();

export async function Board_update(req, res) {
  assert(req.body, PatchBoard);
  const { id } = req.params;

  const board = await prisma.board.findUnique({
    where: { id },
    include: { writer: true },
  });

  // 내거인지 확인하는 로직
  try {
    if (board.writer.email !== req.email) {
      return res.status(403).send({ error: "You are not authorized to delete this product" });
    }

    const updateBoard = await prisma.board.update({
      where: {
        id,
      },

      data: req.body,
    });

    res.send(updateBoard);
  } catch (error) {
    res.status(500).send({ error: "Error deleting product" });
  }
}
