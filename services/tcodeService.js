// services/tcodeService.js

const prisma = require('../db');

// Helper: validate safe tcodeName format
function validateTcodeName(tcodeName) {
  const isValid = /^[a-z0-9_-]+$/.test(tcodeName);
  if (!isValid) {
    throw new Error('Invalid tcodeName: must be lowercase, URL-safe, and use only a-z, 0-9, -, _');
  }
}

// full syllabus
async function getFullSyllabusExport(tcodeName) {
  // fetch chapters + exercises
  const tcode = await getSyllabusShell(tcodeName);
  if (!tcode) {
    throw new Error(`Tcode '${tcodeName}' not found.`);
  }

  // map chapters → exercises
  const chapters = tcode.chapters.map(ch => ({
    filename: ch.filename,
    name: ch.name,
    exercises: ch.exercises.map(ex => ({
      filename: ex.filename,
      name: ex.name
    }))
  }));

  // flatten questions across all exercises
  const questions = [];
  for (const ch of tcode.chapters) {
    for (const ex of ch.exercises) {
      const qList = await prisma.question.findMany({
        where: { exerciseId: ex.id },
        select: { filename: true, name: true, type: true }
      });
      for (const q of qList) {
        questions.push({
          filename: q.filename,
          name: q.name,
          type: q.type,
          chapterFilename: ch.filename,
          exerciseFilename: ex.filename,
          tcodeName: tcode.tcodeName
        });
      }
    }
  }

  return {
    tcodeName:   tcode.tcodeName,
    filename:    tcode.tcodeName,
    description: tcode.description || '',
    image:       tcode.image || '',
    chapters,
    questions
  };
}

// CREATE
async function createTcode(data) {
  validateTcodeName(data.tcodeName);

  const exists = await prisma.tcode.findUnique({
    where: { tcodeName: data.tcodeName }
  });

  if (exists) {
    throw new Error(`Tcode '${data.tcodeName}' already exists.`);
  }

  return prisma.tcode.create({ data });
}

// READ: Get all
async function getAllTcodes() {
  return prisma.tcode.findMany({
    orderBy: {  id: 'desc' }
  });
}

// READ: Get by internal ID
async function getTcodeById(id) {
  return prisma.tcode.findUnique({ where: { id } });
}

// READ: Get by public tcodeName
async function getTcodeByName(tcodeName) {
  return prisma.tcode.findUnique({ where: { tcodeName } });
}

// READ: Get syllabus shell — Tcode → Chapters → Exercises (no questions)
async function getSyllabusShell(tcodeName) {
  return prisma.tcode.findUnique({
    where: { tcodeName },
    include: {
      chapters: {
        orderBy: { id: 'asc' },
        include: {
          exercises: {
            orderBy: { id: 'asc' }
          }
        }
      }
    }
  });
}

// READ: Get exercise and its questions (no content)
async function getTcodeExercise(tcodeName, chapterName, exerciseName) {
  const exercise = await prisma.exercise.findFirst({
    where: {
      chapter: {
        filename: chapterName,
        tcode: { tcodeName }
      },
      filename: exerciseName
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

  if (!exercise) {
    throw new Error('Exercise not found.');
  }

  return exercise;
}

// READ: Get exercise with full question content
async function getTcodeExerciseWContent(tcodeName, chapterName, exerciseName) {
  const exercise = await prisma.exercise.findFirst({
    where: {
      chapter: {
        filename: chapterName,
        tcode: { tcodeName }
      },
      filename: exerciseName
    },
    include: {
      questions: {
        orderBy: { id: 'asc' } // include all fields including content
      }
    }
  });

  if (!exercise) {
    throw new Error('Exercise not found.');
  }

  return exercise;
}

// UPDATE: Only allow changing title/description/image
async function updateTcode(id, data) {
  if ('tcodeName' in data) {
    throw new Error('tcodeName cannot be changed.');
  }

  return prisma.tcode.update({
    where: { id },
    data
  });
}

// DELETE: Only if no chapters exist
async function deleteTcode(id) {
  const tcode = await prisma.tcode.findUnique({
    where: { id },
    include: { chapters: true }
  });

  if (!tcode) {
    throw new Error('Tcode not found.');
  }

  if (tcode.chapters.length > 0) {
    throw new Error('Cannot delete tcode: chapters still exist.');
  }

  return prisma.tcode.delete({ where: { id } });
}

module.exports = {
  createTcode,
  getAllTcodes,
  getTcodeById,
  getTcodeByName,
  getSyllabusShell,
  getTcodeExercise,
  getTcodeExerciseWContent,
  updateTcode,
  deleteTcode,
  getFullSyllabusExport 
};
