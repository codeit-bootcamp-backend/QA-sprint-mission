// import { PrismaClient } from "@prisma/client";
// import { USERS, PRODUCTS } from "./mock";

// const prisma = new PrismaClient();

// async function main() {
//   // 기존 데이터 삭제
//   await prisma.user.deleteMany();
//   await prisma.product.deleteMany();

//   // 목 데이터 삽입
//   await prisma.product.createMany({
//     data: PRODUCTS,
//     skipDuplicates: true,
//   });

//   await prisma.board.createMany({
//     data: BOARD,
//     skipDuplicates: true,
//   });

//   await prisma.comment.createMany({
//     data: COMMENT,
//     skipDuplicates: true,
//   });

//   await Promise.all(
//     USERS.map(async (user) => {
//       await prisma.user.create({ data: user });
//     })
//   );
// }

// main()
//   .then(async () => {
//     await prisma.$disconnect();
//   })
//   .catch(async () => {
//     await prisma.$disconnect();
//     process.exit(1);
//   });
