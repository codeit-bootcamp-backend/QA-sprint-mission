import { PrismaClient } from "@prisma/client";
import { assert } from "superstruct";
import { CreateBoard } from "./board.structs.js";
const prisma = new PrismaClient();

export async function getBoardList(req, res) {
  const { offset = 0, limit = 10, order = "recent", search = "" } = req.query;

  let orderBy;
  switch (order) {
    case "recent":
      orderBy = { createdAt: "desc" };
      break;
    case "likes":
      orderBy = { likeCount: "asc" };
      break;
    default:
      orderBy = { createdAt: "desc" };
      break;
  }

  const boards = await prisma.board.findMany({
    where: {
      OR: [
        {
          title: {
            contains: search,
          },
        },
        {
          content: {
            contains: search,
          },
        },
      ],
    },

    orderBy,
    skip: parseInt(offset),
    take: parseInt(limit),

    select: {
      id: true,
      title: true,
      content: true,
      imageUrl: true,
      createdAt: true,
      writer: true,
      favoriteUser: true,
    },
  });

  res.send(boards);
}

export async function getBoard(req, res) {
  const { id } = req.params;

  const board = await prisma.board.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      content: true,
      imageUrl: true,
      createdAt: true,
      writer: true,
      favoriteUser: true,
    },
  });

  res.send(board);
}

export async function createBoard(req, res) {
  assert(req.body, CreateBoard);
  const { ownerId, ...boardField } = req.body;

  const board = await prisma.board.create({
    data: {
      ...boardField,
      writer: {
        connect: {
          id: ownerId,
        },
      },
    },
  });

  res.send(board);
}

export async function deleteBoard(req, res) {
  const { id } = req.params;

  await prisma.board.delete({
    where: {
      id,
    },
  });

  res.sendStatus(204);
}
