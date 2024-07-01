-- CreateTable
CREATE TABLE "Relationship" (
    "id" SERIAL NOT NULL,
    "follower" TEXT NOT NULL,
    "following" TEXT NOT NULL,

    CONSTRAINT "Relationship_pkey" PRIMARY KEY ("id")
);
