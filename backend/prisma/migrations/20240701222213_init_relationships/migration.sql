-- CreateTable
CREATE TABLE "Relationships" (
    "id" SERIAL NOT NULL,
    "follower" TEXT NOT NULL,
    "following" TEXT NOT NULL,

    CONSTRAINT "Relationships_pkey" PRIMARY KEY ("id")
);
