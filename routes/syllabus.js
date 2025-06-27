// routes/syllabus.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

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

//////////////////////////////////////////////////////////
// ✅ GET Routes
router.get('/syllabus', (req, res) => res.render('syllabus/index'));
router.get('/syllabus/new', (req, res) => res.render('syllabus/new'));
router.get('/syllabus/:id', (req, res) => res.render('syllabus/tree'));
router.get('/syllabus/:id/edit', (req, res) => res.render('syllabus/edit'));
router.get('/syllabus/:id/chapter/new', (req, res) => res.render('syllabus/chapter_new'));
router.get('/syllabus/:id/chapter/:cid/edit', (req, res) => res.render('syllabus/chapter_edit'));
router.get('/syllabus/:id/chapter/:cid/exercise/new', (req, res) => res.render('syllabus/exercise_new'));
router.get('/syllabus/:id/chapter/:cid/exercise/:eid/edit', (req, res) => res.render('syllabus/exercise_edit'));
router.get('/syllabus/:id/question/new', (req, res) => res.render('syllabus/question_new'));
router.get('/syllabus/:id/question/:qid/edit', (req, res) => res.render('syllabus/question_edit'));

//////////////////////////////////////////////////////////
// ✅ POST /syllabus/new (create tcode)
router.post('/syllabus/new', (req, res) => {
  const { tcode_id, title, subject_code } = req.body;

  if (!tcode_id || !title) {
    req.session.flash = { error: 'Tcode ID and Title are required.' };
    return res.redirect('/syllabus/new');
  }

  try {
    writeTcodeFile({ tcode_id, title, subject_code });
    req.session.flash = { success: 'Syllabus created successfully.' };
    res.redirect(`/syllabus/${tcode_id}`);
  } catch (err) {
    console.error(err);
    req.session.flash = { error: 'Failed to create syllabus file.' };
    res.redirect('/syllabus/new');
  }
});

//////////////////////////////////////////////////////////
// TODO: POST routes for chapter, exercise, question etc.
// router.post(...);

module.exports = router;