// scripts/sync-db.js

const fs = require('fs');
const path = require('path');

// Resolve paths relative to this script’s folder
const SOURCE_PATH = path.resolve(__dirname, '../prisma/dev.db');
const DEST_PATH   = path.resolve(__dirname, '../../ui/src/lib/data/dev.db');

console.log('SOURCE_PATH:', SOURCE_PATH);
console.log('DEST_PATH:  ', DEST_PATH);

try {
  // 1. Check source
  if (!fs.existsSync(SOURCE_PATH)) {
    throw new Error(`Source file not found: ${SOURCE_PATH}`);
  }

  // 2. Ensure destination folder exists
  const destDir = path.dirname(DEST_PATH);
  if (!fs.existsSync(destDir)) {
    console.log(`⏳ Creating destination directory: ${destDir}`);
    fs.mkdirSync(destDir, { recursive: true });
  }

  // 3. Copy (overwrite)
  fs.copyFileSync(SOURCE_PATH, DEST_PATH);
  console.log(`✅ Successfully copied dev.db to ${DEST_PATH}`);
} catch (err) {
  console.error(`❌ Failed to sync dev.db:\n  ${err.message}`);
  process.exit(1);
}
