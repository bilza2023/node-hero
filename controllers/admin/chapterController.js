const chapterService = require('../../services/chapterService');
const tcodeService = require('../../services/tcodeService');
const exerciseService = require('../../services/exerciseService');

// CREATE chapter
exports.create = async (req, res) => {
  const { title, filename, tcodeName } = req.body;

  try {
    const tcode = await tcodeService.getTcodeByName(tcodeName);
    if (!tcode) {
      req.flash('error', 'Tcode not found');
      return res.redirect('/admin/tcode');
    }
  
    const data = { title, filename };
    await chapterService.createChapter(tcodeName, data);
  
    req.flash('success', 'Chapter created');
    res.redirect(`/admin/tcode/${tcode.id}/edit`);
  } catch (err) {
    console.error('CreateChapter error:', err.message);
    req.flash('error', err.message);
    res.redirect('/admin/tcode'); // ✅ fallback route, not 'back'
  }  
};

// EDIT form
exports.editForm = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  try {
    const chapter = await chapterService.getChapterById(id);
    if (!chapter) {
      req.flash('error', 'Chapter not found');
      return res.redirect('/admin/tcode');
    }

    const exercises = await exerciseService.getExercisesForChapter(chapter.id);
    res.render('admin/chapter/edit', { chapter, exercises });
  } catch (err) {
    req.flash('error', 'Error loading chapter');
    res.redirect('/admin/tcode');
  }
};

// UPDATE
exports.update = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  try {
    await chapterService.updateChapter(id, { title: req.body.title });
    req.flash('success', 'Chapter updated');
  } catch (err) {
    req.flash('error', err.message);
  }
  res.redirect('back');
};

// DELETE
exports.delete = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  try {
    await chapterService.deleteChapter(id);
    req.flash('success', 'Chapter deleted');
  } catch (err) {
    req.flash('error', err.message);
  }
  res.redirect('back');
};
