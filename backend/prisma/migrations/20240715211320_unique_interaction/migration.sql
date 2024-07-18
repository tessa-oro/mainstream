/*
  Warnings:

  - A unique constraint covering the columns `[user,songItem]` on the table `Interactions` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Interactions_user_songItem_key" ON "Interactions"("user", "songItem");
