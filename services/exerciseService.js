// services/exerciseService.js

const prisma  = require('../db');
const slugify = require('slugify');

// Validate URL‐safe filename format
function validateFilename(name) {
  if (!/^[a-z0-9_-]+$/.test(name)) {
    throw new Error(
      'Invalid filename: must be lowercase, URL-safe, and use only a-z, 0-9, -, _'
    );
  }
}

/**
 * CREATE: Add exercise under chapter by chapterId
 * - System generates filename from the title
 * - Enforces uniqueness within the chapter
 */
async function createExercise(chapterId, data) {
  const { title } = data;

  // 1. Generate system‐owned slug from title
  const filename = slugify(title, { lower: true, strict: true });
  validateFilename(filename);

  // 2. Verify parent chapter exists and load its exercises
  const chapter = await prisma.chapter.findUnique({
    where:   { id: chapterId },
    include: { exercises: true }
  });
  if (!chapter) {
    throw new Error(`Chapter ID ${chapterId} not found.`);
  }

  // 3. Enforce per‐chapter uniqueness
  if (chapter.exercises.some(ex => ex.filename === filename)) {
    throw new Error(`Exercise filename '${filename}' already exists in this chapter.`);
  }

  // 4. Create new exercise
  return prisma.exercise.create({
    data: {
      name:      title,
      filename,
      chapterId: chapter.id
    }
  });
}

/**
 * READ: Get all exercises for a chapter
 */
async function getExercisesForChapter(chapterId) {
  return prisma.exercise.findMany({
    where:   { chapterId },
    orderBy: { id: 'asc' }
  });
}

/**
 * READ: Get exercise by ID
 */
async function getExerciseById(id) {
  return prisma.exercise.findUnique({ where: { id } });
}

/**
 * UPDATE: Only allow changing the title (maps to name)
 * - Filename is immutable
 */
async function updateExercise(id, data) {
  if ('filename' in data) {
    throw new Error('Exercise filename cannot be changed.');
  }
  return prisma.exercise.update({
    where: { id },
    data:  { name: data.title }
  });
}

/**
 * DELETE: Only if exercise has no questions
 */
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
