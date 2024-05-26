import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const authChecker = ({ email }) => {
  if (!email) {
    throw new Error("로그인이 필요한 서비스입니다");
  }
};
