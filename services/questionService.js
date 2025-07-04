// services/questionService.js

const prisma = require('../db');

// Validation
function validateFilename(name) {
  if (!/^[a-z0-9_-]+$/.test(name)) {
    throw new Error('Invalid filename: must be lowercase, URL-safe, and use only a-z, 0-9, -, _');
  }
}

/**
 * Fetch a single question by ID
 */
async function getQuestionById(id) {
  return prisma.question.findUnique({ where: { id } });
}

/**
 * CREATE: add new question including JSON content
 */
async function createQuestion(exerciseId, data) {
  validateFilename(data.filename);

  const exercise = await prisma.exercise.findUnique({
    where: { id: exerciseId },
    include: { questions: true }
  });
  if (!exercise) {
    throw new Error(`Exercise ID ${exerciseId} not found.`);
  }

  if (exercise.questions.some(q => q.filename === data.filename)) {
    throw new Error(`Question filename '${data.filename}' already exists in this exercise.`);
  }

  let parsedContent = null;
  if (data.content) {
    try {
      parsedContent = JSON.parse(data.content);
    } catch {
      throw new Error('Invalid JSON in content field.');
    }
  }

  return prisma.question.create({
    data: {
      name: data.title,
      filename: data.filename,
      type: data.type || 'slide',
      content: parsedContent,
      exerciseId: exercise.id
    }
  });
}

/**
 * READ: all questions under one exercise
 */
async function getQuestionsForExercise(exerciseId) {
  return prisma.question.findMany({
    where: { exerciseId },
    orderBy: { id: 'asc' }
  });
}

/**
 * UPDATE: modify title, type, and content
 */
async function updateQuestion(id, data) {
  const updateData = {};

  if ('title' in data) {
    updateData.name = data.title;
  }
  if ('type' in data) {
    updateData.type = data.type;
  }
  if ('content' in data) {
    if (data.content) {
      try {
        updateData.content = JSON.parse(data.content);
      } catch {
        throw new Error('Invalid JSON in content field.');
      }
    } else {
      updateData.content = null;
    }
  }

  return prisma.question.update({
    where: { id },
    data: updateData
  });
}

/**
 * DELETE
 */
async function deleteQuestion(id) {
  return prisma.question.delete({ where: { id } });
}

module.exports = {
  getQuestionById,
  createQuestion,
  getQuestionsForExercise,
  updateQuestion,
  deleteQuestion
};
