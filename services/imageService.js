import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const SERVER_URL = "http://localhost:3000";

export const uploadImage = async (file) => {
  if (!file) {
    throw new Error("이미지 파일을 선택해주세요.");
  }

  const imagePath = file.path;
  const imageUrl = `${SERVER_URL}/${imagePath.replace(/\\/g, "/")}`;

  const image = await prisma.image.create({
    data: {
      imagePath: imagePath,
    },
  });

  return imageUrl;
};
