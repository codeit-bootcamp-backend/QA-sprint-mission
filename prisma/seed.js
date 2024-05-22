import { PrismaClient } from "@prisma/client";
import data from "./mock.js";
import article from "./mockArticle.js";
const prisma = new PrismaClient();

async function main() {
  await prisma.product.deleteMany();

  await prisma.product.createMany({
    data,
    skipDuplicates: true,
  });

  await prisma.article.deleteMany();

  await prisma.article.createMany({
    data: article,
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
