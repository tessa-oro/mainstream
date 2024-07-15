-- CreateTable
CREATE TABLE "SongItem" (
    "playerID" TEXT NOT NULL,

    CONSTRAINT "SongItem_pkey" PRIMARY KEY ("playerID")
);

-- CreateTable
CREATE TABLE "Interactions" (
    "id" SERIAL NOT NULL,
    "user" TEXT NOT NULL,
    "songItem" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,

    CONSTRAINT "Interactions_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Interactions" ADD CONSTRAINT "Interactions_user_fkey" FOREIGN KEY ("user") REFERENCES "User"("user") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Interactions" ADD CONSTRAINT "Interactions_songItem_fkey" FOREIGN KEY ("songItem") REFERENCES "SongItem"("playerID") ON DELETE RESTRICT ON UPDATE CASCADE;
