-- DropIndex
DROP INDEX "Tcode_tcodeName_idx";

-- AlterTable
ALTER TABLE "Question" ADD COLUMN "content" JSONB;
