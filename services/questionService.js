// services/questionService.js
const prisma = require('../db');

// CREATE
async function createQuestion(data) {
  return prisma.question.create({ data });
}

// READ ALL
async function getAllQuestions() {
  return prisma.question.findMany({
    include: { exercise: true }
  });
}

// READ ONE
async function getQuestionById(id) {
  return prisma.question.findUnique({
    where: { id: parseInt(id, 10) },
    include: { exercise: true }
  });
}

// UPDATE
async function updateQuestion(id, data) {
  return prisma.question.update({
    where: { id: parseInt(id, 10) },
    data
  });
}

// DELETE
async function deleteQuestion(id) {
  return prisma.question.delete({
    where: { id: parseInt(id, 10) }
  });
}

// GET EXERCISE with full nesting (used in GET form)
async function getExerciseFull(exerciseId) {
  const id = parseInt(exerciseId, 10);
  return prisma.exercise.findUnique({
    where: { id },
    include: {
      chapter: {
        include: { tcode: true }
      }
    }
  });
}

// GET EXERCISE basic (used in POSTs)
async function getExerciseBasic(exerciseId) {
  const id = parseInt(exerciseId, 10);
  return prisma.exercise.findUnique({
    where: { id }
  });
}

module.exports = {
  createQuestion,
  getAllQuestions,
  getQuestionById,
  updateQuestion,
  deleteQuestion,
  getExerciseFull,
  getExerciseBasic
};
