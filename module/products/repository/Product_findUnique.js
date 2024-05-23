import { PrismaClient } from "@prisma/client";
import { addIsFavorite } from "../../../helper/addIsFavorite.js";

const prisma = new PrismaClient();

export async function Product_findUnique(req, res) {
  const { id } = req.params;

  const product = await prisma.product.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      description: true,
      price: true,
      tags: true,
      images: true,
      createdAt: true,
      ownerId: true,
      favoriteCount: true,
    },
  });

  const productWithIsFavorite = await addIsFavorite(product, prisma.product);

  res.send(productWithIsFavorite);
}
