/*
  Warnings:

  - You are about to drop the column `imageUrl` on the `Article` table. All the data in the column will be lost.
  - You are about to drop the column `images` on the `Product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Article" DROP COLUMN "imageUrl";

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "images";
