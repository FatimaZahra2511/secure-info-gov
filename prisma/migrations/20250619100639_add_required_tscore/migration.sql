-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Asset" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "owner" TEXT,
    "cScore" INTEGER NOT NULL,
    "iScore" INTEGER NOT NULL,
    "aScore" INTEGER NOT NULL,
    "tScore" INTEGER NOT NULL DEFAULT 1,
    "sensibilite" TEXT,
    "impactOp" INTEGER,
    "impactConf" INTEGER,
    "impactRep" INTEGER,
    "impactFin" INTEGER,
    "probabilite" INTEGER,
    "risk" TEXT NOT NULL,
    "classification" TEXT NOT NULL,
    "fileName" TEXT,
    "fileUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Asset" ("aScore", "cScore", "classification", "createdAt", "department", "fileName", "fileUrl", "iScore", "id", "impactConf", "impactFin", "impactOp", "impactRep", "name", "owner", "probabilite", "risk", "sensibilite") SELECT "aScore", "cScore", "classification", "createdAt", "department", "fileName", "fileUrl", "iScore", "id", "impactConf", "impactFin", "impactOp", "impactRep", "name", "owner", "probabilite", "risk", "sensibilite" FROM "Asset";
DROP TABLE "Asset";
ALTER TABLE "new_Asset" RENAME TO "Asset";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
