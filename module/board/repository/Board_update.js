import { PrismaClient } from "@prisma/client";
import { assert } from "superstruct";
import { PatchBoard } from "../board.structs.js";

const prisma = new PrismaClient();

export async function Board_update(req, res) {
  assert(req.body, PatchBoard);
  const { id } = req.params;

  const board = await prisma.board.update({
    where: {
      id,
    },

    data: req.body,
  });

  res.send(board);
}
