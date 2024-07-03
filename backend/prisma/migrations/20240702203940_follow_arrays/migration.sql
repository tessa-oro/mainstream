/*
  Warnings:

  - You are about to drop the column `followers` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `following` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "followers",
DROP COLUMN "following";

-- CreateTable
CREATE TABLE "Follower" (
    "id" SERIAL NOT NULL,
    "followsName" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Follower_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Following" (
    "id" SERIAL NOT NULL,
    "followedByName" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Following_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Follower" ADD CONSTRAINT "Follower_followsName_fkey" FOREIGN KEY ("followsName") REFERENCES "User"("user") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Following" ADD CONSTRAINT "Following_followedByName_fkey" FOREIGN KEY ("followedByName") REFERENCES "User"("user") ON DELETE CASCADE ON UPDATE CASCADE;
