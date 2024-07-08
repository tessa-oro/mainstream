/*
  Warnings:

  - Added the required column `numRatedSongs` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "numRatedSongs" INTEGER NOT NULL;
