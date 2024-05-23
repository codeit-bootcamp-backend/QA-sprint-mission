/*
  Warnings:

  - You are about to drop the column `ownerId` on the `Board` table. All the data in the column will be lost.
  - You are about to drop the column `ownerId` on the `Product` table. All the data in the column will be lost.
  - Added the required column `owner` to the `Board` table without a default value. This is not possible if the table is not empty.
  - Added the required column `owner` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Board" DROP CONSTRAINT "Board_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_ownerId_fkey";

-- AlterTable
ALTER TABLE "Board" DROP COLUMN "ownerId",
ADD COLUMN     "owner" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "ownerId",
ADD COLUMN     "owner" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_owner_fkey" FOREIGN KEY ("owner") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Board" ADD CONSTRAINT "Board_owner_fkey" FOREIGN KEY ("owner") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
