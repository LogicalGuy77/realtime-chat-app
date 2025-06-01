/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `Rooms` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `Rooms` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Rooms" ADD COLUMN     "slug" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Rooms_slug_key" ON "Rooms"("slug");
