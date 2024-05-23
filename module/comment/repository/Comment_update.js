import { PrismaClient } from "@prisma/client";
import { assert } from "superstruct";
import { PatchComment } from "../comment.struct.js";

const prisma = new PrismaClient();

export async function Comment_update(req, res) {
  assert(req.body, PatchComment);

  const { id } = req.params;
  const product = await prisma.comment.update({
    where: {
      id,
    },

    data: req.body,
  });

  res.send(product);
}
