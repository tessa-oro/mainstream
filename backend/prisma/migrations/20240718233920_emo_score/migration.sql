/*
  Warnings:

  - Added the required column `emotionScores` to the `Song` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Song" ADD COLUMN     "emotionScores" JSONB NOT NULL;
