import { assert } from "superstruct";
import { PrismaClient } from "@prisma/client";
import { CreateComment } from "../comment.struct.js";

const prisma = new PrismaClient();

export async function Comment_create_onProduct(req, res) {
  assert(req.body, CreateComment);
  const { id: productId } = req.params;
  const { ...commentField } = req.body;

  const comment = await prisma.comment.create({
    data: {
      ...commentField,
      taggedUnion: "Product",
      writerId: { connect: { email: req.email } },
      productId: { connect: { id: productId } },
    },
  });

  res.send(comment);
}

export async function Comment_create_onBoard(req, res) {
  assert(req.body, CreateComment);
  const { id: BoardId } = req.params;
  const { ...commentField } = req.body;

  const comment = await prisma.comment.create({
    data: {
      ...commentField,
      taggedUnion: "Board",
      writerId: { connect: { email: req.email } },
      boardId: { connect: { id: BoardId } },
    },
  });

  res.send(comment);
}
