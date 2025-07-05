// services/contentImportService.js

const fs    = require('fs');
const path  = require('path');
const prisma = require('../db');

// Dynamically load the ESM DeckBuilder
async function buildDeckFromCode(codeStr) {
  // 1. import the ESM module
  const { DeckBuilder } = await import('taleem-pivot-deckbuilder');

  // 2. instantiate and apply the code
  const deckbuilder = new DeckBuilder();
  // we pass the instance in, not the class, to avoid new Function eval of imports
  const fn = new Function('deckbuilder', `
    ${codeStr}
    return deckbuilder.build();
  `);

  return fn(deckbuilder);
}

async function importQuestionContentFromFiles(baseDir) {
  const summary = { total: 0, matched: 0, updated: 0, errors: [] };

  const walkDir = (dir) => {
    let files = [];
    for (const entry of fs.readdirSync(dir)) {
      const full = path.join(dir, entry);
      if (fs.statSync(full).isDirectory()) {
        files = files.concat(walkDir(full));
      } else if (entry.endsWith('.js')) {
        files.push(full);
      }
    }
    return files;
  };

  const allFiles = walkDir(baseDir);
  summary.total = allFiles.length;

  for (const file of allFiles) {
    const filename = path.basename(file, '.js');
    try {
      const question = await prisma.question.findFirst({ where: { filename } });
      if (!question) {
        summary.errors.push(`No DB match for ${filename}`);
        continue;
      }

      const code = fs.readFileSync(file, 'utf8');
      const json = await buildDeckFromCode(code);

      await prisma.question.update({
        where: { id: question.id },
        data: { content: json }
      });

      summary.matched += 1;
      summary.updated += 1;
    } catch (err) {
      summary.errors.push(`${filename}: ${err.message}`);
    }
  }

  return summary;
}

module.exports = { importQuestionContentFromFiles };
