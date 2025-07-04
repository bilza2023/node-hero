const exerciseService = require('../../services/exerciseService');
const tcodeService = require('../../services/tcodeService');
const chapterService = require('../../services/chapterService');

// SECTION A: Index (list + form renderer)
exports.index = async (req, res) => {
  const { tcode, tcodeId, chapter, chapterId } = req.query;
 debugger;
  try {
    // Get exercises for this chapter
    const exercises = await exerciseService.getExercisesForChapter(Number(chapterId));

    res.render('exercise_master', {
      tcode,
      tcodeId,
      chapter,
      chapterId,
      exercises
    });
  } catch (err) {
    req.flash('error', err.message);
    res.redirect('/admin/chapter');
  }
};

// SECTION B: Create Exercise
exports.create = async (req, res) => {
  debugger;
  const { chapterId, title, filename, tcode, tcodeId, chapter } = req.body;

  try {
    await exerciseService.createExercise(Number(chapterId), { title, filename });
    req.flash('success', 'Exercise created');
  } catch (err) {
    req.flash('error', err.message);
  }

  res.redirect(`/admin/exercise?tcode=${encodeURIComponent(tcode)}&tcodeId=${tcodeId}&chapter=${encodeURIComponent(chapter)}&chapterId=${chapterId}`);
};

// SECTION C: Update Exercise
exports.update = async (req, res) => {
  const exerciseId = parseInt(req.params.id, 10);
  const { chapterId, title, tcode, tcodeId, chapter } = req.body;

  try {
    if (Number.isNaN(exerciseId)) {
      throw new Error('Invalid exercise ID.');
    }

    await exerciseService.updateExercise(exerciseId, { title });
    req.flash('success', 'Exercise updated');
  } catch (err) {
    req.flash('error', err.message || 'Could not update exercise');
  }

  res.redirect(`/admin/exercise?tcode=${encodeURIComponent(tcode)}&tcodeId=${tcodeId}&chapter=${encodeURIComponent(chapter)}&chapterId=${chapterId}`);
};

// SECTION D: Delete Exercise
exports.delete = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { tcode, tcodeId, chapter, chapterId } = req.query;

  try {
    await exerciseService.deleteExercise(id);
    req.flash('success', 'Exercise deleted');
  } catch (err) {
    req.flash('error', err.message);
  }

  res.redirect(`/admin/exercise?tcode=${encodeURIComponent(tcode)}&tcodeId=${tcodeId}&chapter=${encodeURIComponent(chapter)}&chapterId=${chapterId}`);
};
