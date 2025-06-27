-- CreateTable
CREATE TABLE "Tcode" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "tcodeName" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "image" TEXT
);

-- CreateTable
CREATE TABLE "Chapter" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "filename" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "image" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "tcodeId" INTEGER NOT NULL,
    CONSTRAINT "Chapter_tcodeId_fkey" FOREIGN KEY ("tcodeId") REFERENCES "Tcode" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Exercise" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "filename" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "image" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "chapterId" INTEGER NOT NULL,
    CONSTRAINT "Exercise_chapterId_fkey" FOREIGN KEY ("chapterId") REFERENCES "Chapter" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Question" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "filename" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "exerciseId" INTEGER NOT NULL,
    CONSTRAINT "Question_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "Exercise" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Tcode_tcodeName_key" ON "Tcode"("tcodeName");

-- CreateIndex
CREATE INDEX "Tcode_tcodeName_idx" ON "Tcode"("tcodeName");

-- CreateIndex
CREATE INDEX "Chapter_tcodeId_idx" ON "Chapter"("tcodeId");

-- CreateIndex
CREATE INDEX "Chapter_filename_idx" ON "Chapter"("filename");

-- CreateIndex
CREATE INDEX "Exercise_chapterId_idx" ON "Exercise"("chapterId");

-- CreateIndex
CREATE INDEX "Exercise_filename_idx" ON "Exercise"("filename");

-- CreateIndex
CREATE UNIQUE INDEX "Question_filename_key" ON "Question"("filename");

-- CreateIndex
CREATE INDEX "Question_exerciseId_idx" ON "Question"("exerciseId");
