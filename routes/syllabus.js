// routes/syllabus.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const syllabusRoot = path.join(__dirname, '../data/syllabus');
const { NewTcodeSchema } = require('../prisma/zodSchemas');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

//////////////////////////////////////////////////////////
// ✅ Helper: Write Tcode File (taxonomy)
function writeTcodeFile({ tcode_id, title, subject_code }) {
  const data = {
    tcodeName: tcode_id,
    title: title,
    description: '',
    image: `/pivot/${tcode_id}.webp`,
    chapters: []
  };

  const fileContent = `export const ${tcode_id} = ${JSON.stringify(data, null, 2)};\n`;
  const dir = path.join(__dirname, `../data/syllabus/${tcode_id}`);
  fs.mkdirSync(dir, { recursive: true });

  const filePath = path.join(dir, `${tcode_id}.js`);
  fs.writeFileSync(filePath, fileContent, 'utf-8');

  // Create empty questions.js
  const questionsPath = path.join(dir, `${tcode_id}_questions.js`);
  fs.writeFileSync(questionsPath, `export const ${tcode_id}Questions = []\n`, 'utf-8');
}
// ✅ GET /syllabus — Load from tcodes.json instead of scanning folders
router.get('/syllabus', (req, res) => {
    // console.log('✅ GET /syllabus route entered');
    const filePath = path.join(__dirname, '../data/syllabus/tcodes.json');

    let tcodes = [];
  
    try {
      const raw = fs.readFileSync(filePath, 'utf-8');
      tcodes = JSON.parse(raw);
      console.log(`🧾 Loaded ${tcodes.length} tcodes`);
    } catch (err) {
      console.error('❌ Failed to read tcodes.json', err);
    }
  
    res.render('syllabus/index', { tcodes });
  });
  
//////////////////////////////////////////////////////////
router.post('/syllabus/new', async (req, res) => {
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

    await prisma.tcode.create({
      data: { tcodeName, title, description, image }
    });

    req.session.flash = { success: 'Syllabus created successfully.' };
    res.redirect(`/syllabus/${tcodeName}`);
  } catch (err) {
    console.error('❌ Failed to insert tcode:', err);
    req.session.flash = { error: 'Database error. Try again.' };
    res.redirect('/syllabus/new');
  }
});
//////////////////////////////////////////////////////////
router.get('/syllabus/:id', (req, res) => res.render('syllabus/tree'));
router.get('/syllabus/:id/edit', (req, res) => res.render('syllabus/edit'));
router.get('/syllabus/:id/chapter/new', (req, res) => res.render('syllabus/chapter_new'));
router.get('/syllabus/:id/chapter/:cid/edit', (req, res) => res.render('syllabus/chapter_edit'));
router.get('/syllabus/:id/chapter/:cid/exercise/new', (req, res) => res.render('syllabus/exercise_new'));
router.get('/syllabus/:id/chapter/:cid/exercise/:eid/edit', (req, res) => res.render('syllabus/exercise_edit'));
router.get('/syllabus/:id/question/new', (req, res) => res.render('syllabus/question_new'));
router.get('/syllabus/:id/question/:qid/edit', (req, res) => res.render('syllabus/question_edit'));

//////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////
// TODO: POST routes for chapter, exercise, question etc.
// router.post(...);

module.exports = router;