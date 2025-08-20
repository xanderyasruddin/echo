/*
  Warnings:

  - You are about to drop the column `locationId` on the `Save` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,postId]` on the table `Save` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `postId` to the `Save` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Save" DROP CONSTRAINT "Save_locationId_fkey";

-- DropIndex
DROP INDEX "Save_userId_locationId_idx";

-- DropIndex
DROP INDEX "Save_userId_locationId_key";

-- AlterTable
ALTER TABLE "Save" DROP COLUMN "locationId",
ADD COLUMN     "postId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Save_userId_postId_idx" ON "Save"("userId", "postId");

-- CreateIndex
CREATE UNIQUE INDEX "Save_userId_postId_key" ON "Save"("userId", "postId");

-- AddForeignKey
ALTER TABLE "Save" ADD CONSTRAINT "Save_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;
