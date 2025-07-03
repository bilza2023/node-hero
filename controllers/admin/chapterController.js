// controllers/admin/chapterController.js

const tcodeService   = require('../../services/tcodeService');
const chapterService = require('../../services/chapterService');

// SECTION A: Index (list + form renderer)
exports.index = async (req, res) => {
  try {
    const allTcodes = await tcodeService.getAllTcodes();
    const tcodeName = req.query.tcode;

    let tcode = null;
    let chapters = [];
    let chapterToEdit = null;

    // Load tcode and chapters if filter is active
    if (tcodeName) {
      const result = await chapterService.getChaptersForTcode(tcodeName);
      tcode    = result.tcode;
      chapters = result.chapters;
    }

    // Load chapter to edit if edit param is active
    if (req.query.edit) {
      chapterToEdit = await chapterService.getChapterById(parseInt(req.query.edit, 10));
    }

    // Render master page with all context
    res.render('chapter_master', {
      allTcodes,
      tcode,
      chapters,
      chapterToEdit
    });
  } catch (err) {
    req.flash('error', err.message);
    return res.redirect('/admin/chapter');
  }
};

// SECTION B: Create Chapter
exports.create = async (req, res) => {
  const { tcodeId, title, filename } = req.body;
  try {
    const numericTcodeId = Number(tcodeId);
    await chapterService.createChapter(numericTcodeId, { title, filename });

    const tcode = await tcodeService.getTcodeById(numericTcodeId);
    req.flash('success', 'Chapter created');

    res.redirect(`/admin/chapter?tcode=${encodeURIComponent(tcode.tcodeName)}`);
  } catch (err) {
    req.flash('error', err.message);
    res.redirect('/admin/chapter');
  }
};

// SECTION C: Update Chapter
exports.update = async (req, res) => {
  const chapterId = Number.parseInt(req.params.id, 10);
  const { tcodeId, title } = req.body;

  try {
    if (Number.isNaN(chapterId)) {
      throw new Error('Invalid chapter ID.');
    }

    await chapterService.updateChapter(chapterId, { title });

    const tcode = await tcodeService.getTcodeById(Number(tcodeId));
    req.flash('success', 'Chapter updated');

    res.redirect(`/admin/chapter?tcode=${encodeURIComponent(tcode.tcodeName)}`);
  } catch (err) {
    req.flash('error', err.message || 'Could not update chapter');
    res.redirect('/admin/chapter');
  }
};

// SECTION D: Delete Chapter
exports.delete = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const tcodeName = req.query.tcode;

  try {
    await chapterService.deleteChapter(id);
    req.flash('success', 'Chapter deleted');
  } catch (err) {
    req.flash('error', err.message);
  }

  res.redirect(`/admin/chapter?tcode=${encodeURIComponent(tcodeName)}`);
};
