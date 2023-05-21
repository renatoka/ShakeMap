-- CreateTable
CREATE TABLE "Earthquakes" (
    "id" SERIAL NOT NULL,
    "auth" TEXT NOT NULL,
    "depth" INTEGER NOT NULL,
    "evtype" TEXT NOT NULL,
    "flynn_region" TEXT NOT NULL,
    "lastupdate" TIMESTAMP(3) NOT NULL,
    "lat" DOUBLE PRECISION NOT NULL,
    "lon" DOUBLE PRECISION NOT NULL,
    "mag" DOUBLE PRECISION NOT NULL,
    "magtype" TEXT NOT NULL,
    "source_catalog" TEXT NOT NULL,
    "time" TIMESTAMP(3) NOT NULL,
    "unid" TEXT NOT NULL,
    "source_id" TEXT NOT NULL,

    CONSTRAINT "Earthquakes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Users" (
    "id" SERIAL NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "activeSubscription" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Earthquakes_unid_key" ON "Earthquakes"("unid");

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");
