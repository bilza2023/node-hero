const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { NewQuestionSchema } = require('../../prisma/zodSchemas');

const prisma = new PrismaClient();

///////////////////////////////////////////////////////////
// GET /syllabus/question/new?exercise=ID
router.get('/question/new', async (req, res) => {
  const { exercise } = req.query;

  try {
    const exerciseObj = await prisma.exercise.findUnique({
      where: { id: parseInt(exercise) },
      include: {
        chapter: {
          include: { tcode: true }
        }
      }
    });

    if (!exerciseObj) {
      return res.status(404).send('Exercise not found.');
    }

    const chapter = exerciseObj.chapter;
    const tcode = chapter.tcode;

    res.render('syllabus/question_new', {
      tcode,
      chapter,
      exercise: exerciseObj
    });
  } catch (err) {
    console.error('❌ Error showing question form:', err);
    res.status(500).send('Internal Server Error');
  }
});

///////////////////////////////////////////////////////////
// POST /syllabus/question/new
router.post('/question/new', async (req, res) => {
  const result = NewQuestionSchema.safeParse(req.body);
  if (!result.success) {
    req.session.flash = { error: result.error.errors[0].message };
    return res.redirect(`/syllabus/question/new?exercise=${req.body.exercise}`);
  }

  try {
    const exercise = await prisma.exercise.findUnique({
      where: { id: parseInt(result.data.exercise) }
    });

    if (!exercise) {
      req.session.flash = { error: 'Invalid exercise.' };
      return res.redirect(`/syllabus/question/new?exercise=${result.data.exercise}`);
    }

    await prisma.question.create({
      data: {
        filename: result.data.filename,
        name: result.data.name,
        type: result.data.type,
        exerciseId: exercise.id
      }
    });

    req.session.flash = { success: 'Question created.' };
    res.redirect(`/syllabus/${exercise.chapterId}`);
  } catch (err) {
    console.error('❌ Question creation failed:', err);
    req.session.flash = { error: 'Insert failed.' };
    res.redirect(`/syllabus/question/new?exercise=${req.body.exercise}`);
  }
});

///////////////////////////////////////////////////////////
// POST /syllabus/question/:qid/edit
router.post('/question/:qid/edit', async (req, res) => {
  const result = NewQuestionSchema.safeParse(req.body);
  if (!result.success) {
    req.session.flash = { error: result.error.errors[0].message };
    return res.redirect(`/syllabus/question/${req.params.qid}/edit`);
  }

  try {
    const exercise = await prisma.exercise.findUnique({
      where: { id: parseInt(result.data.exercise) }
    });

    if (!exercise) {
      req.session.flash = { error: 'Invalid exercise.' };
      return res.redirect(`/syllabus/question/${req.params.qid}/edit`);
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
    res.redirect(`/syllabus/${exercise.chapterId}`);
  } catch (err) {
    console.error('❌ Question update failed:', err);
    req.session.flash = { error: 'Update failed.' };
    res.redirect(`/syllabus/question/${req.params.qid}/edit`);
  }
});

///////////////////////////////////////////////////////////
// POST /syllabus/:id/question/:qid/delete
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
