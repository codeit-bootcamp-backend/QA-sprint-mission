import { PrismaClient } from "@prisma/client";
import { addIsFavorite } from "../../../helper/addIsFavorite.js";

const prisma = new PrismaClient();

export async function Product_findMany(req, res) {
  const { offset = 0, limit = 10, order = "recent", search = "" } = req.query;

  let orderBy;
  switch (order) {
    case "recent":
      orderBy = { createdAt: "desc" };
      break;
    case "favorite":
      orderBy = { favoriteCount: "asc" };
      break;
    default:
      orderBy = { createdAt: "desc" };
      break;
  }

  const products = await prisma.product.findMany({
    where: {
      OR: [
        {
          name: {
            contains: search,
          },
        },
        {
          description: {
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
      name: true,
      price: true,
      images: true,
      createdAt: true,
      ownerId: true,
      favoriteCount: true,
    },
  });

  const queries = products.map(async (item) => {
    return addIsFavorite(item, prisma.product);
  });

  const productWithIsFavorite = await Promise.all(queries);

  res.send(productWithIsFavorite);
}
