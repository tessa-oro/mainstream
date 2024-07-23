/*
  Warnings:

  - You are about to drop the column `artist` on the `Song` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Song` table. All the data in the column will be lost.
  - Added the required column `stats` to the `Song` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Song" DROP COLUMN "artist",
DROP COLUMN "title",
ADD COLUMN     "stats" JSONB NOT NULL;
