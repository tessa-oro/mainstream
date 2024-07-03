/*
  Warnings:

  - A unique constraint covering the columns `[followsName,name]` on the table `Follower` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[followedByName,name]` on the table `Following` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Follower_followsName_name_key" ON "Follower"("followsName", "name");

-- CreateIndex
CREATE UNIQUE INDEX "Following_followedByName_name_key" ON "Following"("followedByName", "name");
