// services/chapterService.js

const prisma = require('../db')

// Validate URL-safe and filename-safe format
function validateFilename(name) {
  const isValid = /^[a-z0-9_-]+$/.test(name)
  if (!isValid) {
    throw new Error(
      'Invalid filename: must be lowercase, URL-safe, and use only a-z, 0-9, -, _'
    )
  }
}

// CREATE: Add a chapter under a given tcodeName
async function createChapter(tcodeName, data) {
  // data is expected to have { title, filename }
  const { title, filename } = data

  validateFilename(filename)

  // Load parent Tcode with its chapters
  const tcode = await prisma.tcode.findUnique({
    where: { tcodeName },
    include: { chapters: true }
  })
  if (!tcode) {
    throw new Error(`Tcode '${tcodeName}' not found.`)
  }

  // Enforce unique filename per Tcode
  if (tcode.chapters.some(ch => ch.filename === filename)) {
    throw new Error(
      `Chapter filename '${filename}' already exists in this syllabus.`
    )
  }

  // **Here we map your `title` → Prisma's required `name` field**
  return prisma.chapter.create({
    data: {
      name: title,
      filename,
      tcodeId: tcode.id
    }
  })
}

// READ: Get chapter by internal ID
async function getChapterById(id) {
  return prisma.chapter.findUnique({ where: { id } })
}

// READ: Get chapter by tcodeName + filename
async function getChapterByFilename(tcodeName, filename) {
  return prisma.chapter.findFirst({
    where: {
      filename,
      tcode: { tcodeName }
    }
  })
}

// READ: Get chapter and its exercises (by name)
async function getChapterExercises(tcodeName, chapterFilename) {
  return prisma.chapter.findFirst({
    where: {
      filename: chapterFilename,
      tcode: { tcodeName }
    },
    include: {
      exercises: {
        orderBy: { id: 'asc' }
      }
    }
  })
}

// UPDATE: Only allow changing the chapter’s title → Prisma’s `name`
async function updateChapter(id, data) {
  if ('filename' in data) {
    throw new Error('Chapter filename cannot be changed.')
  }
  if (!('title' in data)) {
    // nothing to update
    return prisma.chapter.findUnique({ where: { id } })
  }

  return prisma.chapter.update({
    where: { id },
    data: {
      name: data.title
    }
  })
}

// DELETE: Only if chapter has no exercises
async function deleteChapter(id) {
  const exercises = await prisma.exercise.findMany({
    where: { chapterId: id }
  })

  if (exercises.length > 0) {
    throw new Error('Cannot delete: chapter still contains exercises.')
  }

  return prisma.chapter.delete({ where: { id } })
}

module.exports = {
  createChapter,
  getChapterById,
  getChapterByFilename,
  getChapterExercises,
  updateChapter,
  deleteChapter
}
