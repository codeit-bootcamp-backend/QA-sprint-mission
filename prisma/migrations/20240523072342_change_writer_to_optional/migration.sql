-- AlterTable
ALTER TABLE "Article" ALTER COLUMN "imageUrl" SET DEFAULT '',
ALTER COLUMN "writer" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Comment" ALTER COLUMN "writer" DROP NOT NULL;
