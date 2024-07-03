/*
  Warnings:

  - A unique constraint covering the columns `[follower,following]` on the table `Relationship` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Relationship_follower_following_key" ON "Relationship"("follower", "following");
