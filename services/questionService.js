// services/questionService.js

const prisma   = require('../db');
const slugify  = require('slugify');

// Validate URL-safe filename format
function validateFilename(name) {
  if (!/^[a-z0-9_-]+$/.test(name)) {
    throw new Error(
      'Invalid filename: must be lowercase, URL-safe, and use only a-z, 0-9, -, _'
    );
  }
}

/**
 * CREATE: add new question including JSON content
 * – System generates a global slug from title + parent hierarchy
 * – Enforces global uniqueness
 */
async function createQuestion(exerciseId, data) {
  const { title, type, content } = data;

  // 1. Fetch parent exercise → chapter → tcode for hierarchy
  const exercise = await prisma.exercise.findUnique({
    where: { id: exerciseId },
    include: {
      chapter: {
        include: {
          tcode: true
        }
      }
    }
  });
  if (!exercise) {
    throw new Error(`Exercise ID ${exerciseId} not found.`);
  }

  const tcodeSlug     = exercise.chapter.tcode.tcodeName;
  const chapterSlug   = exercise.chapter.filename;
  const exerciseSlug  = exercise.filename;

  // 2. Generate question‐level slug from title
  const questionSlug = slugify(title, { lower: true, strict: true });
  // 3. Combine into global filename
  const filename = `${tcodeSlug}__${chapterSlug}__${exerciseSlug}__${questionSlug}`;
  validateFilename(filename);

  // 4. Enforce global uniqueness
  const existing = await prisma.question.findUnique({ where: { filename } });
  if (existing) {
    throw new Error(`Question filename '${filename}' already exists.`);
  }

  // 5. Parse JSON content if provided
  let parsedContent = null;
  if (content) {
    try {
      parsedContent = JSON.parse(content);
    } catch {
      throw new Error('Invalid JSON in content field.');
    }
  }

  // 6. Create record
  return prisma.question.create({
    data: {
      name:       title,
      filename,
      type:       type || 'slide',
      content:    parsedContent,
      exerciseId
    }
  });
}

/**
 * READ: all questions under one exercise
 */
async function getQuestionsForExercise(exerciseId) {
  return prisma.question.findMany({
    where:   { exerciseId },
    orderBy: { id: 'asc' }
  });
}

/**
 * FETCH a single question by ID
 */
async function getQuestionById(id) {
  return prisma.question.findUnique({ where: { id } });
}

/**
 * UPDATE: modify title, type, and content (filename immutable)
 */
async function updateQuestion(id, data) {
  if ('filename' in data) {
    throw new Error('Question filename cannot be changed.');
  }

  const updateData = {};
  if ('title' in data)   updateData.name    = data.title;
  if ('type' in data)    updateData.type    = data.type;
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
    data:  updateData
  });
}

/**
 * DELETE a question
 */
async function deleteQuestion(id) {
  return prisma.question.delete({ where: { id } });
}

module.exports = {
  createQuestion,
  getQuestionsForExercise,
  getQuestionById,
  updateQuestion,
  deleteQuestion
};
