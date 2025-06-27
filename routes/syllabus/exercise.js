const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { NewExerciseSchema } = require('../../prisma/zodSchemas');

const prisma = new PrismaClient();

//////////////////////////////////////////////////////////
// GET /syllabus/:id/chapter/:cid/exercise/new
router.get('/:id/chapter/:cid/exercise/new', async (req, res) => {
  try {
    const chapter = await prisma.chapter.findUnique({
      where: { id: parseInt(req.params.cid) }
    });
    if (!chapter) return res.status(404).send('Chapter not found');

    const tcode = await prisma.tcode.findUnique({ where: { tcodeName: req.params.id } });
    res.render('syllabus/exercise_new', { chapter, tcode });
  } catch (err) {
    console.error('❌ Failed to show exercise form:', err);
    res.status(500).send('Internal Server Error');
  }
});

//////////////////////////////////////////////////////////
// POST /syllabus/:id/chapter/:cid/exercise/new
router.post('/:id/chapter/:cid/exercise/new', async (req, res) => {
  const result = NewExerciseSchema.safeParse(req.body);
  if (!result.success) {
    req.session.flash = { error: result.error.errors[0].message };
    return res.redirect(`/syllabus/${req.params.id}/chapter/${req.params.cid}/exercise/new`);
  }

  try {
    await prisma.exercise.create({
      data: {
        ...result.data,
        chapterId: parseInt(req.params.cid)
      }
    });

    req.session.flash = { success: 'Exercise added.' };
    res.redirect(`/syllabus/${req.params.id}`);
  } catch (err) {
    console.error('❌ Failed to insert exercise:', err);
    req.session.flash = { error: 'Insert failed.' };
    res.redirect(`/syllabus/${req.params.id}/chapter/${req.params.cid}/exercise/new`);
  }
});

//////////////////////////////////////////////////////////
// GET /syllabus/:id/chapter/:cid/exercise/:eid/edit
router.get('/:id/chapter/:cid/exercise/:eid/edit', async (req, res) => {
  try {
    const exercise = await prisma.exercise.findUnique({
      where: { id: parseInt(req.params.eid) }
    });
    if (!exercise) return res.status(404).send('Exercise not found');

    const chapter = await prisma.chapter.findUnique({
      where: { id: parseInt(req.params.cid) }
    });

    const tcode = await prisma.tcode.findUnique({ where: { tcodeName: req.params.id } });

    res.render('syllabus/exercise_edit', { tcode, chapter, exercise });
  } catch (err) {
    console.error('❌ Failed to load exercise edit:', err);
    res.status(500).send('Internal Server Error');
  }
});

//////////////////////////////////////////////////////////
// POST /syllabus/:id/chapter/:cid/exercise/:eid/edit
router.post('/:id/chapter/:cid/exercise/:eid/edit', async (req, res) => {
  const result = NewExerciseSchema.safeParse(req.body);
  if (!result.success) {
    req.session.flash = { error: result.error.errors[0].message };
    return res.redirect(`/syllabus/${req.params.id}/chapter/${req.params.cid}/exercise/${req.params.eid}/edit`);
  }

  try {
    await prisma.exercise.update({
      where: { id: parseInt(req.params.eid) },
      data: result.data
    });

    req.session.flash = { success: 'Exercise updated.' };
    res.redirect(`/syllabus/${req.params.id}`);
  } catch (err) {
    console.error('❌ Failed to update exercise:', err);
    req.session.flash = { error: 'Update failed.' };
    res.redirect(`/syllabus/${req.params.id}/chapter/${req.params.cid}/exercise/${req.params.eid}/edit`);
  }
});

//////////////////////////////////////////////////////////
// POST /syllabus/:id/chapter/:cid/exercise/:eid/delete
router.post('/:id/chapter/:cid/exercise/:eid/delete', async (req, res) => {
  try {
    const questions = await prisma.question.findMany({
      where: { exerciseId: parseInt(req.params.eid) }
    });

    if (questions.length > 0) {
      req.session.flash = { error: 'Cannot delete: questions exist.' };
      return res.redirect(`/syllabus/${req.params.id}`);
    }

    await prisma.exercise.delete({ where: { id: parseInt(req.params.eid) } });
    req.session.flash = { success: 'Exercise deleted.' };
    res.redirect(`/syllabus/${req.params.id}`);
  } catch (err) {
    console.error('❌ Delete failed:', err);
    req.session.flash = { error: 'Delete failed.' };
    res.redirect(`/syllabus/${req.params.id}`);
  }
});

module.exports = router;
