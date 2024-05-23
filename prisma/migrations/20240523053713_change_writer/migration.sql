/*
  Warnings:

  - You are about to drop the column `author` on the `Comment` table. All the data in the column will be lost.
  - Added the required column `writer` to the `Comment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_author_fkey";

-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "author",
ADD COLUMN     "writer" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_writer_fkey" FOREIGN KEY ("writer") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
