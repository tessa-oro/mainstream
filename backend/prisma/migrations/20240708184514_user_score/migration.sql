/*
  Warnings:

  - Added the required column `score` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "score" DECIMAL(65,30) NOT NULL;
