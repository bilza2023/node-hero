const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { NewQuestionSchema } = require('../../prisma/zodSchemas');

const prisma = new PrismaClient();

//////////////////////////////////////////////////////////
// GET /syllabus/:id/question/new — new question form
router.get('/:id/question/new', async (req, res) => {
  try {
    const tcode = await prisma.tcode.findUnique({
      where: { tcodeName: req.params.id },
      include: {
        chapters: {
          include: { exercises: true },
          orderBy: { id: 'asc' }
        }
      }
    });

    if (!tcode) return res.status(404).send('Tcode not found');
    res.render('syllabus/question_new', { tcode });
  } catch (err) {
    console.error('❌ Error showing question form:', err);
    res.status(500).send('Internal Server Error');
  }
});

//////////////////////////////////////////////////////////
// POST /syllabus/:id/question/new — insert question
router.post('/:id/question/new', async (req, res) => {
  const result = NewQuestionSchema.safeParse(req.body);
  if (!result.success) {
    req.session.flash = { error: result.error.errors[0].message };
    return res.redirect(`/syllabus/${req.params.id}/question/new`);
  }

  const { filename, name, type, exercise } = result.data;

  try {
    const exerciseObj = await prisma.exercise.findFirst({
      where: { filename: exercise }
    });

    if (!exerciseObj) {
      req.session.flash = { error: 'Invalid exercise.' };
      return res.redirect(`/syllabus/${req.params.id}/question/new`);
    }

    await prisma.question.create({
      data: {
        filename,
        name,
        type,
        exerciseId: exerciseObj.id
      }
    });

    req.session.flash = { success: 'Question added.' };
    res.redirect(`/syllabus/${req.params.id}`);
  } catch (err) {
    console.error('❌ Question insert failed:', err);
    req.session.flash = { error: 'Insert failed.' };
    res.redirect(`/syllabus/${req.params.id}/question/new`);
  }
});

//////////////////////////////////////////////////////////
// GET /syllabus/:id/question/:qid/edit — form
router.get('/:id/question/:qid/edit', async (req, res) => {
  try {
    const question = await prisma.question.findUnique({
      where: { id: parseInt(req.params.qid) },
      include: {
        exercise: {
          include: {
            chapter: {
              include: { tcode: true }
            }
          }
        }
      }
    });

    if (!question) return res.status(404).send('Question not found');

    const tcode = await prisma.tcode.findUnique({
      where: { tcodeName: req.params.id },
      include: {
        chapters: {
          include: { exercises: true }
        }
      }
    });

    res.render('syllabus/question_edit', { question, tcode });
  } catch (err) {
    console.error('❌ Failed to show question edit form:', err);
    res.status(500).send('Internal Server Error');
  }
});

//////////////////////////////////////////////////////////
// POST /syllabus/:id/question/:qid/edit — update
router.post('/:id/question/:qid/edit', async (req, res) => {
  const result = NewQuestionSchema.safeParse(req.body);
  if (!result.success) {
    req.session.flash = { error: result.error.errors[0].message };
    return res.redirect(`/syllabus/${req.params.id}/question/${req.params.qid}/edit`);
  }

  try {
    const exercise = await prisma.exercise.findFirst({
      where: { filename: result.data.exercise }
    });

    if (!exercise) {
      req.session.flash = { error: 'Invalid exercise.' };
      return res.redirect(`/syllabus/${req.params.id}/question/${req.params.qid}/edit`);
    }

    await prisma.question.update({
      where: { id: parseInt(req.params.qid) },
      data: {
        filename: result.data.filename,
        name: result.data.name,
        type: result.data.type,
        exerciseId: exercise.id
      }
    });

    req.session.flash = { success: 'Question updated.' };
    res.redirect(`/syllabus/${req.params.id}`);
  } catch (err) {
    console.error('❌ Question update failed:', err);
    req.session.flash = { error: 'Update failed.' };
    res.redirect(`/syllabus/${req.params.id}/question/${req.params.qid}/edit`);
  }
});

//////////////////////////////////////////////////////////
// POST /syllabus/:id/question/:qid/delete — remove
router.post('/:id/question/:qid/delete', async (req, res) => {
  try {
    await prisma.question.delete({
      where: { id: parseInt(req.params.qid) }
    });

    req.session.flash = { success: 'Question deleted.' };
    res.redirect(`/syllabus/${req.params.id}`);
  } catch (err) {
    console.error('❌ Question delete failed:', err);
    req.session.flash = { error: 'Delete failed.' };
    res.redirect(`/syllabus/${req.params.id}`);
  }
});

module.exports = router;
