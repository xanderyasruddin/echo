/*
  Warnings:

  - You are about to drop the `SavedLocation` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
ALTER TYPE "NotificationType" ADD VALUE 'SAVE';

-- DropForeignKey
ALTER TABLE "SavedLocation" DROP CONSTRAINT "SavedLocation_locationId_fkey";

-- DropForeignKey
ALTER TABLE "SavedLocation" DROP CONSTRAINT "SavedLocation_userId_fkey";

-- DropTable
DROP TABLE "SavedLocation";

-- CreateTable
CREATE TABLE "Save" (
    "id" TEXT NOT NULL,
    "locationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Save_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Save_userId_locationId_idx" ON "Save"("userId", "locationId");

-- CreateIndex
CREATE UNIQUE INDEX "Save_userId_locationId_key" ON "Save"("userId", "locationId");

-- AddForeignKey
ALTER TABLE "Save" ADD CONSTRAINT "Save_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Save" ADD CONSTRAINT "Save_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
