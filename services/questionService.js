// services/questionService.js

const prisma = require('../db');

// Validate URL-safe and filename-safe format
function validateFilename(name) {
  const isValid = /^[a-z0-9_-]+$/.test(name);
  if (!isValid) {
    throw new Error('Invalid filename: must be lowercase, URL-safe, and use only a-z, 0-9, -, _');
  }
}

// CREATE: Create question under a specific exercise
async function createQuestion(tcodeName, chapterFilename, exerciseFilename, data) {
  validateFilename(data.filename);

  const exercise = await prisma.exercise.findFirst({
    where: {
      filename: exerciseFilename,
      chapter: {
        filename: chapterFilename,
        tcode: { tcodeName }
      }
    }
  });

  if (!exercise) {
    throw new Error(`Exercise '${exerciseFilename}' not found in '${chapterFilename}'.`);
  }

  const exists = await prisma.question.findUnique({
    where: { filename: data.filename }
  });

  if (exists) {
    throw new Error(`Question filename '${data.filename}' already exists.`);
  }

  return prisma.question.create({
    data: {
      ...data,
      exerciseId: exercise.id
    }
  });
}

// READ: Get question by internal ID
async function getQuestionById(id) {
  return prisma.question.findUnique({
    where: { id }
  });
}

// READ: Get question by its unique string filename
async function getQuestionByFilename(filename) {
  return prisma.question.findUnique({
    where: { filename }
  });
}

// UPDATE: Cannot change filename or exerciseId
async function updateQuestion(id, data) {
  if ('filename' in data || 'exerciseId' in data) {
    throw new Error('filename and exerciseId cannot be updated.');
  }

  return prisma.question.update({
    where: { id },
    data
  });
}

// DELETE: Simple delete by ID
async function deleteQuestion(id) {
  return prisma.question.delete({ where: { id } });
}

module.exports = {
  createQuestion,
  getQuestionById,
  getQuestionByFilename,
  updateQuestion,
  deleteQuestion
};
