import { assert } from "superstruct";
import { PrismaClient } from "@prisma/client";
import { CreateComment } from "../comment.struct";

const prisma = new PrismaClient();

export async function Comment_create_onProduct(req, res) {
  assert(req.body, CreateComment);
  const { id: productId } = req.params;
  const { ownerId, ...commentField } = req.body;

  const comment = await prisma.comment.create({
    data: {
      ...commentField,
      authorId: { connect: { id: ownerId } },
      productId: { connect: { id: productId } },
    },
  });

  res.send(comment);
}

export async function Comment_create_onBoard(req, res) {
  assert(req.body, CreateComment);
  const { id: BoardId } = req.params;
  const { ownerId, ...commentField } = req.body;

  const comment = await prisma.comment.create({
    data: {
      ...commentField,
      authorId: { connect: { id: ownerId } },
      boardId: { connect: { id: BoardId } },
    },
  });

  res.send(comment);
}
