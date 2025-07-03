// services/chapterService.js

const prisma = require('../db');

// Validate URL-safe filename format
function validateFilename(filename) {
  if (!/^[a-z0-9_-]+$/.test(filename)) {
    throw new Error('Invalid filename: must be lowercase, URL-safe, and use only a-z, 0-9, -, _');
  }
}

// CREATE: Add a chapter under a given tcodeName
async function createChapter(tcodeName, data) {
  debugger;
  const { title, filename } = data;
  validateFilename(filename);

  const tcode = await prisma.tcode.findUnique({
    where: { tcodeName },
    include: { chapters: true }
  });
  if (!tcode) {
    throw new Error(`Tcode '${tcodeName}' not found.`);
  }

  if (tcode.chapters.some(ch => ch.filename === filename)) {
    throw new Error(`Chapter filename '${filename}' already exists in this syllabus.`);
  }

  return prisma.chapter.create({
    data: {
      name: title,
      filename,
      tcodeId: tcode.id
    }
  });
}

// READ: List chapters for a given tcodeName
async function getChaptersForTcode(tcodeName) {
  const tcode = await prisma.tcode.findUnique({
    where: { tcodeName },
    include: { chapters: { orderBy: { id: 'asc' } } }
  });
  if (!tcode) {
    throw new Error(`Tcode '${tcodeName}' not found.`);
  }
  return { tcode, chapters: tcode.chapters };
}

// READ: Get chapter by internal ID
async function getChapterById(id) {
  return prisma.chapter.findUnique({ where: { id } });
}

// READ: Get chapter by filename within a tcode
async function getChapterByFilename(tcodeName, filename) {
  return prisma.chapter.findFirst({
    where: {
      filename,
      tcode: { tcodeName }
    }
  });
}

// READ: Get chapter and its exercises
async function getChapterExercises(tcodeName, chapterFilename) {
  return prisma.chapter.findFirst({
    where: {
      filename: chapterFilename,
      tcode: { tcodeName }
    },
    include: {
      exercises: { orderBy: { id: 'asc' } }
    }
  });
}

// UPDATE: Only allow changing the chapter’s title (maps to name)
async function updateChapter(id, data) {
  if ('filename' in data) {
    throw new Error('Chapter filename cannot be changed.');
  }

  if (!('title' in data)) {
    const existing = await prisma.chapter.findUnique({ where: { id } });
    return { ...existing, title: existing.name };
  }

  const updated = await prisma.chapter.update({
    where: { id },
    data: { name: data.title }
  });
  return { ...updated, title: updated.name };
}

// DELETE: Only if chapter has no exercises
async function deleteChapter(id) {
  const exercises = await prisma.exercise.findMany({
    where: { chapterId: id }
  });
  if (exercises.length > 0) {
    throw new Error('Cannot delete: chapter still contains exercises.');
  }
  return prisma.chapter.delete({ where: { id } });
}

module.exports = {
  createChapter,
  getChaptersForTcode,
  getChapterById,
  getChapterByFilename,
  getChapterExercises,
  updateChapter,
  deleteChapter
};
