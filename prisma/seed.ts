import { PrismaClient } from "@prisma/client";
import { ARTICLES, COMMENTS, FAVORITE, IMAGE, PRODUCTS, USERS } from "./mock.js";
const prisma = new PrismaClient();

async function main() {
  await prisma.user.deleteMany();

  await prisma.user.createMany({
    data: USERS,
    skipDuplicates: true,
  });
  await prisma.product.deleteMany();

  await prisma.product.createMany({
    data: PRODUCTS,
    skipDuplicates: true,
  });

  await prisma.article.deleteMany();

  await prisma.article.createMany({
    data: ARTICLES,
    skipDuplicates: true,
  });

  await prisma.image.deleteMany();

  await prisma.image.createMany({
    data: IMAGE,
    skipDuplicates: true,
  });

  await prisma.favorite.deleteMany();

  await prisma.favorite.createMany({
    data: FAVORITE,
    skipDuplicates: true,
  });

  await prisma.comment.deleteMany();

  await prisma.comment.createMany({
    data: COMMENTS,
    skipDuplicates: true,
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
