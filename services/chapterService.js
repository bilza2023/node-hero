const prisma = require('../db');

async function createChapter(data) {
  return prisma.chapter.create({ data });
}

async function getAllChapters() {
  return prisma.chapter.findMany();
}

async function getChapterById(id) {
  return prisma.chapter.findUnique({ where: { id } });
}

async function updateChapter(id, data) {
  return prisma.chapter.update({ where: { id }, data });
}

async function deleteChapter(id) {
  return prisma.chapter.delete({ where: { id } });
}

module.exports = {
  createChapter,
  getAllChapters,
  getChapterById,
  updateChapter,
  deleteChapter,
};
