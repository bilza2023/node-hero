const prisma = require('../db');

async function createQuestion(data) {
  return prisma.question.create({ data });
}

async function getAllQuestions() {
  return prisma.question.findMany({ include: { exercise: true } });
}

async function getQuestionById(id) {
  return prisma.question.findUnique({ where: { id }, include: { exercise: true } });
}

async function updateQuestion(id, data) {
  return prisma.question.update({ where: { id }, data });
}

async function deleteQuestion(id) {
  return prisma.question.delete({ where: { id } });
}

module.exports = {
  createQuestion,
  getAllQuestions,
  getQuestionById,
  updateQuestion,
  deleteQuestion,
};
