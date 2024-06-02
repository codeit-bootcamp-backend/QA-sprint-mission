/*
  Warnings:

  - Made the column `writer` on table `Article` required. This step will fail if there are existing NULL values in that column.
  - Made the column `writer` on table `Comment` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `writer` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Article" ALTER COLUMN "writer" SET NOT NULL;

-- AlterTable
ALTER TABLE "Comment" ALTER COLUMN "writer" SET NOT NULL;

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "writer" TEXT NOT NULL;
