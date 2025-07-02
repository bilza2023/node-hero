// services/exerciseService.js

const prisma = require('../db');

// Validate URL-safe and filename-safe format
function validateFilename(name) {
  const isValid = /^[a-z0-9_-]+$/.test(name);
  if (!isValid) {
    throw new Error('Invalid filename: must be lowercase, URL-safe, and use only a-z, 0-9, -, _');
  }
}

// CREATE: Add exercise under chapter (requires tcodeName + chapterFilename)
async function createExercise(tcodeName, chapterFilename, data) {
  validateFilename(data.filename);

  const chapter = await prisma.chapter.findFirst({
    where: {
      filename: chapterFilename,
      tcode: { tcodeName }
    },
    include: { exercises: true }
  });

  if (!chapter) {
    throw new Error(`Chapter '${chapterFilename}' not found in '${tcodeName}'.`);
  }

  const exists = chapter.exercises.find(ex => ex.filename === data.filename);
  if (exists) {
    throw new Error(`Exercise filename '${data.filename}' already exists in this chapter.`);
  }

  return prisma.exercise.create({
    data: {
      ...data,
      chapterId: chapter.id
    }
  });
}

// READ: Get exercise by internal ID
async function getExerciseById(id) {
  return prisma.exercise.findUnique({ where: { id } });
}

// READ: Get by tcode + chapter + exercise filename
async function getExerciseByFilename(tcodeName, chapterFilename, exerciseFilename) {
  return prisma.exercise.findFirst({
    where: {
      filename: exerciseFilename,
      chapter: {
        filename: chapterFilename,
        tcode: { tcodeName }
      }
    }
  });
}

// READ: Get exercise with its questions (no .content)
async function getExerciseQuestions(tcodeName, chapterFilename, exerciseFilename) {
  return prisma.exercise.findFirst({
    where: {
      filename: exerciseFilename,
      chapter: {
        filename: chapterFilename,
        tcode: { tcodeName }
      }
    },
    include: {
      questions: {
        orderBy: { id: 'asc' },
        select: {
          id: true,
          name: true,
          filename: true,
          type: true
        }
      }
    }
  });
}

// READ: Get exercise with full question content
async function getExerciseQuestionsWithContent(tcodeName, chapterFilename, exerciseFilename) {
  return prisma.exercise.findFirst({
    where: {
      filename: exerciseFilename,
      chapter: {
        filename: chapterFilename,
        tcode: { tcodeName }
      }
    },
    include: {
      questions: {
        orderBy: { id: 'asc' }
      }
    }
  });
}

// UPDATE: Cannot change filename
async function updateExercise(id, data) {
  if ('filename' in data) {
    throw new Error('Exercise filename cannot be changed.');
  }

  return prisma.exercise.update({
    where: { id },
    data
  });
}

// DELETE: Only if no questions
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
  getExerciseById,
  getExerciseByFilename,
  getExerciseQuestions,
  getExerciseQuestionsWithContent,
  updateExercise,
  deleteExercise
};
