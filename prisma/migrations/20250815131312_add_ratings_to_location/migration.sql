/*
  Warnings:

  - You are about to drop the column `visitedAt` on the `Post` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Location" ADD COLUMN     "numberOfRatings" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "sumOfRatings" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "types" TEXT,
ADD COLUMN     "website" TEXT;

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "visitedAt";
