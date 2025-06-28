const prisma = require('../db');

async function createExercise(data) {
  return prisma.exercise.create({ data });
}

async function getAllExercises() {
  return prisma.exercise.findMany({ include: { chapter: true } });
}

async function getExerciseById(id) {
  return prisma.exercise.findUnique({ where: { id }, include: { chapter: true } });
}

async function updateExercise(id, data) {
  return prisma.exercise.update({ where: { id }, data });
}

async function deleteExercise(id) {
  return prisma.exercise.delete({ where: { id } });
}

module.exports = {
  createExercise,
  getAllExercises,
  getExerciseById,
  updateExercise,
  deleteExercise,
};
