-- CreateTable
CREATE TABLE "Song" (
    "id" SERIAL NOT NULL,
    "cover" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "artist" TEXT NOT NULL,
    "audio" TEXT NOT NULL,
    "ratings" INTEGER[],
    "userID" TEXT NOT NULL,

    CONSTRAINT "Song_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Song" ADD CONSTRAINT "Song_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("user") ON DELETE CASCADE ON UPDATE CASCADE;
