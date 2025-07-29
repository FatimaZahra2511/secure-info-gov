-- CreateTable
CREATE TABLE "Asset" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "owner" TEXT,
    "cScore" INTEGER NOT NULL,
    "iScore" INTEGER NOT NULL,
    "aScore" INTEGER NOT NULL,
    "risk" TEXT NOT NULL,
    "classification" TEXT NOT NULL,
    "fileName" TEXT,
    "fileUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
