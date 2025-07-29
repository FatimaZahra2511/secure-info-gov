-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Audit" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "action" TEXT NOT NULL,
    "docId" TEXT NOT NULL,
    "nom" TEXT,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Audit" ("action", "docId", "id", "nom", "timestamp") SELECT "action", "docId", "id", "nom", "timestamp" FROM "Audit";
DROP TABLE "Audit";
ALTER TABLE "new_Audit" RENAME TO "Audit";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
