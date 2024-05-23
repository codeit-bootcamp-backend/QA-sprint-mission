/*
  Warnings:

  - You are about to drop the column `nickname` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `Comment` table. All the data in the column will be lost.
  - Added the required column `nickname` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "nickname",
DROP COLUMN "password";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "nickname" TEXT NOT NULL,
ADD COLUMN     "password" TEXT NOT NULL;
