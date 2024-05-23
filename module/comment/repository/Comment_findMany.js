import { PrismaClient } from "@prisma/client";
import { addIsFavorite } from "../../../helper/addIsFavorite.js";

const prisma = new PrismaClient();

export async function Comment_findMany_onBoard(req, res) {
  const { offset = 0, limit = 10, order = "recent" } = req.query;

  let orderBy;
  switch (order) {
    case "recent":
      orderBy = { createdAt: "desc" };
      break;
    default:
      orderBy = { createdAt: "asc" };
      break;
  }

  const comment = await prisma.comment.findMany({
    where: { taggedUnion: "Board" },

    orderBy,
    skip: parseInt(offset),
    take: parseInt(limit),

    select: {
      id: true,
      comment: true,
      createdAt: true,
      writerId: true,
    },
  });

  res.send(comment);
}

export async function Comment_findMany_onProduct(req, res) {
  const { offset = 0, limit = 10, order = "recent" } = req.query;

  let orderBy;
  switch (order) {
    case "recent":
      orderBy = { createdAt: "desc" };
      break;
    default:
      orderBy = { createdAt: "asc" };
      break;
  }

  const comment = await prisma.comment.findMany({
    where: { taggedUnion: "Product" },

    orderBy,
    skip: parseInt(offset),
    take: parseInt(limit),

    select: {
      id: true,
      comment: true,
      createdAt: true,
      writerId: true,
    },
  });

  res.send(comment);
}
