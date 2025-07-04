// services/exerciseService.js

const prisma = require('../db');

// Validate URL-safe and filename-safe format
function validateFilename(name) {
  const isValid = /^[a-z0-9_-]+$/.test(name);
  if (!isValid) {
    throw new Error('Invalid filename: must be lowercase, URL-safe, and use only a-z, 0-9, -, _');
  }
}

// CREATE: Add exercise under chapter by chapterId
async function createExercise(chapterId, data) {
  validateFilename(data.filename);

  const chapter = await prisma.chapter.findUnique({
    where: { id: chapterId },
    include: { exercises: true }
  });

  if (!chapter) {
    throw new Error(`Chapter ID ${chapterId} not found.`);
  }

  const exists = chapter.exercises.find(ex => ex.filename === data.filename);
  if (exists) {
    throw new Error(`Exercise filename '${data.filename}' already exists in this chapter.`);
  }

  return prisma.exercise.create({
    data: {
      name: data.title,
      filename: data.filename,
      chapterId: chapter.id
    }
  });
}

// READ: Get all exercises for a chapter
async function getExercisesForChapter(chapterId) {
  return prisma.exercise.findMany({
    where: { chapterId },
    orderBy: { id: 'asc' }
  });
}

// READ: Get exercise by ID
async function getExerciseById(id) {
  return prisma.exercise.findUnique({ where: { id } });
}

// UPDATE: Only allow title update
async function updateExercise(id, data) {
  if ('filename' in data) {
    throw new Error('Exercise filename cannot be changed.');
  }

  return prisma.exercise.update({
    where: { id },
    data: { name: data.title }
  });
}

// DELETE: Only if exercise has no questions
async function deleteExercise(id) {
  const questions = await prisma.question.findMany({
    where: { exerciseId: id }
  });

  if (questions.length > 0) {
    throw new Error('Cannot delete: exercise still contains questions.');
  }

  return prisma.exercise.delete({ where: { id } });
}

module.exports = {
  createExercise,
  getExercisesForChapter,
  getExerciseById,
  updateExercise,
  deleteExercise
};
