/*
  Warnings:

  - You are about to drop the `_FavoriteArticles` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_FavoriteArticles" DROP CONSTRAINT "_FavoriteArticles_A_fkey";

-- DropForeignKey
ALTER TABLE "_FavoriteArticles" DROP CONSTRAINT "_FavoriteArticles_B_fkey";

-- DropTable
DROP TABLE "_FavoriteArticles";

-- CreateTable
CREATE TABLE "_FavoriteBoards" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_FavoriteBoards_AB_unique" ON "_FavoriteBoards"("A", "B");

-- CreateIndex
CREATE INDEX "_FavoriteBoards_B_index" ON "_FavoriteBoards"("B");

-- AddForeignKey
ALTER TABLE "_FavoriteBoards" ADD CONSTRAINT "_FavoriteBoards_A_fkey" FOREIGN KEY ("A") REFERENCES "Board"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FavoriteBoards" ADD CONSTRAINT "_FavoriteBoards_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
