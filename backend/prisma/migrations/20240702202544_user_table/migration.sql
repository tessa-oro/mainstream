/*
  Warnings:

  - You are about to drop the `Relationship` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "followers" TEXT[],
ADD COLUMN     "following" TEXT[];

-- DropTable
DROP TABLE "Relationship";
