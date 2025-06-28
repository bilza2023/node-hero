const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { NewTcodeSchema } = require('../../prisma/zodSchemas');

const prisma = new PrismaClient();

//////////////////////////////////////////////////////////
// GET /syllabus — show all syllabi
router.get('/', async (req, res) => {
  try {
    const tcodes = await prisma.tcode.findMany({
      orderBy: { title: 'asc' }
    });
    res.render('syllabus/index', { tcodes });
  } catch (err) {
    console.error('❌ Failed to load tcodes:', err);
    res.status(500).send('Internal Server Error');
  }
});

//////////////////////////////////////////////////////////
// GET /syllabus/new — form to create syllabus
router.get('/new', (req, res) => {
  res.render('syllabus/new');
});

//////////////////////////////////////////////////////////
// POST /syllabus/new — create syllabus
router.post('/new', async (req, res) => {
  const result = NewTcodeSchema.safeParse(req.body);

  if (!result.success) {
    req.session.flash = { error: result.error.errors[0].message };
    return res.redirect('/syllabus/new');
  }

  const { tcodeName, title, description, image } = result.data;

  try {
    const exists = await prisma.tcode.findUnique({ where: { tcodeName } });
    if (exists) {
      req.session.flash = { error: `Tcode '${tcodeName}' already exists.` };
      return res.redirect('/syllabus/new');
    }

    await prisma.tcode.create({ data: { tcodeName, title, description, image } });

    req.session.flash = { success: 'Syllabus created successfully.' };
    res.redirect(`/syllabus/${tcodeName}`);
  } catch (err) {
    console.error('❌ Failed to insert tcode:', err);
    req.session.flash = { error: 'Database error. Try again.' };
    res.redirect('/syllabus/new');
  }
});

//////////////////////////////////////////////////////////
router.get('/:id', async (req, res) => {
  try {
    const tcode = await prisma.tcode.findUnique({
      where: { tcodeName: req.params.id },
      include: {
        chapters: {
          include: {
            exercises: {
              include: { questions: true },
              orderBy: { id: 'asc' }
            }
          },
          orderBy: { id: 'asc' }
        }
      }
    });
    

    if (!tcode) return res.status(404).send('Tcode not found');

    res.render('syllabus/tree', { tcode });
  } catch (err) {
    console.error('❌ Failed to load full tcode tree:', err);
    res.status(500).send('Internal Server Error');
  }
});

//////////////////////////////////////////////////////////
// GET /syllabus/:id/edit — form to edit syllabus
router.get('/:id/edit', async (req, res) => {
  try {
    const tcode = await prisma.tcode.findUnique({
      where: { tcodeName: req.params.id }
    });
    if (!tcode) return res.status(404).send('Tcode not found');
    res.render('syllabus/edit', { tcode });
  } catch (err) {
    console.error('❌ Failed to load tcode for edit:', err);
    res.status(500).send('Internal Server Error');
  }
});

//////////////////////////////////////////////////////////
// POST /syllabus/:id/edit — update syllabus
router.post('/:id/edit', async (req, res) => {
  const result = NewTcodeSchema.safeParse(req.body);
  if (!result.success) {
    req.session.flash = { error: result.error.errors[0].message };
    return res.redirect(`/syllabus/${req.params.id}/edit`);
  }

  try {
    await prisma.tcode.update({
      where: { tcodeName: req.params.id },
      data: result.data
    });
    req.session.flash = { success: 'Syllabus updated successfully.' };
    res.redirect(`/syllabus/${req.params.id}`);
  } catch (err) {
    console.error('❌ Failed to update tcode:', err);
    req.session.flash = { error: 'Database error during update.' };
    res.redirect(`/syllabus/${req.params.id}/edit`);
  }
});

//////////////////////////////////////////////////////////
// POST /syllabus/:id/delete — delete syllabus
router.post('/:id/delete', async (req, res) => {
  try {
    const tcode = await prisma.tcode.findUnique({
      where: { tcodeName: req.params.id },
      include: { chapters: true }
    });

    if (!tcode || tcode.chapters.length > 0) {
      req.session.flash = { error: 'Cannot delete: syllabus still has chapters.' };
      return res.redirect(`/syllabus/${req.params.id}`);
    }

    await prisma.tcode.delete({ where: { tcodeName: req.params.id } });
    req.session.flash = { success: 'Syllabus deleted successfully.' };
    res.redirect('/syllabus');
  } catch (err) {
    console.error('❌ Failed to delete tcode:', err);
    req.session.flash = { error: 'Delete failed. Try again.' };
    res.redirect(`/syllabus/${req.params.id}`);
  }
});

module.exports = router;
