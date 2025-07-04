// services/questionService.js

const prisma = require('../db');

// Validation
function validateFilename(name) {
  if (!/^[a-z0-9_-]+$/.test(name)) {
    throw new Error('Invalid filename: must be lowercase, URL-safe, and use only a-z, 0-9, -, _');
  }
}

// CREATE: Add question under exercise
async function createQuestion(exerciseId, data) {
  validateFilename(data.filename);

  const exercise = await prisma.exercise.findUnique({
    where: { id: exerciseId },
    include: { questions: true }
  });

  if (!exercise) {
    throw new Error(`Exercise ID ${exerciseId} not found.`);
  }

  const exists = exercise.questions.find(q => q.filename === data.filename);
  if (exists) {
    throw new Error(`Question filename '${data.filename}' already exists in this exercise.`);
  }

  return prisma.question.create({
    data: {
      name: data.title,
      filename: data.filename,
      type: data.type || 'slide',
      exerciseId: exercise.id
    }
  });
}

// READ: Get all questions under an exercise
async function getQuestionsForExercise(exerciseId) {
  return prisma.question.findMany({
    where: { exerciseId },
    orderBy: { id: 'asc' }
  });
}

// UPDATE
async function updateQuestion(id, data) {
  if ('filename' in data) {
    throw new Error('Question filename cannot be changed.');
  }

  return prisma.question.update({
    where: { id },
    data: { name: data.title }
  });
}

// DELETE
async function deleteQuestion(id) {
  return prisma.question.delete({ where: { id } });
}

module.exports = {
  createQuestion,
  getQuestionsForExercise,
  updateQuestion,
  deleteQuestion
};
