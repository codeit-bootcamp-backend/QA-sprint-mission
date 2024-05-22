/*
  Warnings:

  - Added the required column `likeCount` to the `Board` table without a default value. This is not possible if the table is not empty.
  - Added the required column `favoriteCount` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Board" ADD COLUMN     "likeCount" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "favoriteCount" INTEGER NOT NULL;
