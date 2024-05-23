import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function Board_findMany(req, res) {
  const { offset = 0, limit = 10, order = "recent", search = "" } = req.query;

  let orderBy;
  switch (order) {
    case "recent":
      orderBy = { createdAt: "desc" };
      break;
    case "likes":
      orderBy = { likeCount: "desc" };
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
      likeCount: true,
      favoriteUser: true,
    },
  });

  res.send(boards);
}
