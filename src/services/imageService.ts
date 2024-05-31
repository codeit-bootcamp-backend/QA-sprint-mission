import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const SERVER_URL = "http://localhost:3000";

export const uploadImage = async (file: Express.Multer.File | undefined): Promise<string> => {
  if (!file) {
    throw new Error("이미지 파일을 선택해주세요.");
  }

  const imagePath = file.path;
  const imageUrl = `${SERVER_URL}/${imagePath.replace(/\\/g, "/")}`;

  await prisma.image.create({
    data: {
      imagePath: imagePath,
    },
  });

  return imageUrl;
};
