import { Prisma } from "@prisma/client";
import bcrypt from "bcrypt";
import prisma from "../client";

export const createUser = async (email: string, password: string, name: string, nickname: string) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    return await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        nickname,
      },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      throw new Error("이미 존재하는 이메일입니다.");
    }
    throw error;
  }
};

export const findUserByEmail = async (email: string) => {
  return prisma.user.findUnique({
    where: { email },
  });
};

export const findUserById = async (id: number) => {
  return prisma.user.findUnique({
    where: { id },
  });
};

export const validatePassword = async (inputPassword: string, storedPassword: string) => {
  return bcrypt.compare(inputPassword, storedPassword);
};