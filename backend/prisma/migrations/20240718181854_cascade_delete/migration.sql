-- DropForeignKey
ALTER TABLE "Interactions" DROP CONSTRAINT "Interactions_songItem_fkey";

-- DropForeignKey
ALTER TABLE "Interactions" DROP CONSTRAINT "Interactions_user_fkey";

-- AddForeignKey
ALTER TABLE "Interactions" ADD CONSTRAINT "Interactions_user_fkey" FOREIGN KEY ("user") REFERENCES "User"("user") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Interactions" ADD CONSTRAINT "Interactions_songItem_fkey" FOREIGN KEY ("songItem") REFERENCES "SongItem"("playerID") ON DELETE CASCADE ON UPDATE CASCADE;
