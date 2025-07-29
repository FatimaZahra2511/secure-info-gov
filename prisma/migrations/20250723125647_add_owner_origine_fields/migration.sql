/*
  Warnings:

  - You are about to drop the column `description` on the `Asset` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Asset" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "owner" TEXT,
    "origine" TEXT,
    "destination" TEXT,
    "formatPapier" BOOLEAN NOT NULL,
    "formatElectronique" BOOLEAN NOT NULL,
    "dp" BOOLEAN,
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
    "exposition" INTEGER,
    "attenuation" INTEGER,
    "risqueBrut" INTEGER,
    "risqueResiduel" INTEGER,
    "risqueAccepte" TEXT,
    "analyseRisque" TEXT,
    "mesuresExistantes" TEXT,
    "risk" TEXT NOT NULL,
    "classification" TEXT NOT NULL,
    "fileName" TEXT,
    "fileUrl" TEXT,
    "processus" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Asset" ("aScore", "analyseRisque", "attenuation", "cScore", "classification", "createdAt", "department", "destination", "dp", "exposition", "fileName", "fileUrl", "formatElectronique", "formatPapier", "iScore", "id", "impactConf", "impactFin", "impactOp", "impactRep", "mesuresExistantes", "name", "origine", "owner", "probabilite", "processus", "risk", "risqueAccepte", "risqueBrut", "risqueResiduel", "sensibilite", "tScore") SELECT "aScore", "analyseRisque", "attenuation", "cScore", "classification", "createdAt", "department", "destination", "dp", "exposition", "fileName", "fileUrl", "formatElectronique", "formatPapier", "iScore", "id", "impactConf", "impactFin", "impactOp", "impactRep", "mesuresExistantes", "name", "origine", "owner", "probabilite", "processus", "risk", "risqueAccepte", "risqueBrut", "risqueResiduel", "sensibilite", "tScore" FROM "Asset";
DROP TABLE "Asset";
ALTER TABLE "new_Asset" RENAME TO "Asset";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
