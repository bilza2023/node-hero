const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { NewChapterSchema } = require('../../prisma/zodSchemas');

const prisma = new PrismaClient();

//////////////////////////////////////////////////////////
// GET /syllabus/:id/chapter/new — show chapter form
router.get('/:id/chapter/new', async (req, res) => {
  try {
    const tcode = await prisma.tcode.findUnique({ where: { tcodeName: req.params.id } });
    if (!tcode) return res.status(404).send('Tcode not found');
    res.render('syllabus/chapter_new', { tcode });
  } catch (err) {
    console.error('❌ Chapter form error:', err);
    res.status(500).send('Internal Server Error');
  }
});

//////////////////////////////////////////////////////////
// POST /syllabus/:id/chapter/new — insert chapter
router.post('/:id/chapter/new', async (req, res) => {
  const result = NewChapterSchema.safeParse(req.body);
  if (!result.success) {
    req.session.flash = { error: result.error.errors[0].message };
    return res.redirect(`/syllabus/${req.params.id}/chapter/new`);
  }

  try {
    const tcode = await prisma.tcode.findUnique({ where: { tcodeName: req.params.id } });
    if (!tcode) {
      req.session.flash = { error: 'Tcode does not exist.' };
      return res.redirect('/syllabus');
    }

    await prisma.chapter.create({
      data: {
        ...result.data,
        tcodeId: tcode.id
      }
    });

    req.session.flash = { success: 'Chapter created successfully.' };
    res.redirect(`/syllabus/${req.params.id}`);
  } catch (err) {
    console.error('❌ Failed to insert chapter:', err);
    req.session.flash = { error: 'Insert failed.' };
    res.redirect(`/syllabus/${req.params.id}/chapter/new`);
  }
});

//////////////////////////////////////////////////////////
// GET /syllabus/:id/chapter/:cid/edit — form to edit
router.get('/:id/chapter/:cid/edit', async (req, res) => {
  try {
    const chapter = await prisma.chapter.findUnique({ where: { id: parseInt(req.params.cid) } });
    if (!chapter) return res.status(404).send('Chapter not found');

    const tcode = await prisma.tcode.findUnique({ where: { tcodeName: req.params.id } });

    res.render('syllabus/chapter_edit', { tcode, chapter });
  } catch (err) {
    console.error('❌ Failed to load chapter edit form:', err);
    res.status(500).send('Internal Server Error');
  }
});

//////////////////////////////////////////////////////////
// POST /syllabus/:id/chapter/:cid/edit — update chapter
router.post('/:id/chapter/:cid/edit', async (req, res) => {
  const result = NewChapterSchema.safeParse(req.body);
  if (!result.success) {
    req.session.flash = { error: result.error.errors[0].message };
    return res.redirect(`/syllabus/${req.params.id}/chapter/${req.params.cid}/edit`);
  }

  try {
    await prisma.chapter.update({
      where: { id: parseInt(req.params.cid) },
      data: result.data
    });

    req.session.flash = { success: 'Chapter updated successfully.' };
    res.redirect(`/syllabus/${req.params.id}`);
  } catch (err) {
    console.error('❌ Chapter update failed:', err);
    req.session.flash = { error: 'Update failed.' };
    res.redirect(`/syllabus/${req.params.id}/chapter/${req.params.cid}/edit`);
  }
});

//////////////////////////////////////////////////////////
// POST /syllabus/:id/chapter/:cid/delete — delete chapter
router.post('/:id/chapter/:cid/delete', async (req, res) => {
  try {
    const exercises = await prisma.exercise.findMany({
      where: { chapterId: parseInt(req.params.cid) }
    });

    if (exercises.length > 0) {
      req.session.flash = { error: 'Cannot delete: exercises still exist.' };
      return res.redirect(`/syllabus/${req.params.id}`);
    }

    await prisma.chapter.delete({ where: { id: parseInt(req.params.cid) } });
    req.session.flash = { success: 'Chapter deleted.' };
    res.redirect(`/syllabus/${req.params.id}`);
  } catch (err) {
    console.error('❌ Chapter delete failed:', err);
    req.session.flash = { error: 'Delete failed.' };
    res.redirect(`/syllabus/${req.params.id}`);
  }
});

module.exports = router;
