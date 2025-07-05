/*
  Warnings:

  - A unique constraint covering the columns `[filename]` on the table `Chapter` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[filename]` on the table `Exercise` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Chapter_filename_key" ON "Chapter"("filename");

-- CreateIndex
CREATE UNIQUE INDEX "Exercise_filename_key" ON "Exercise"("filename");
