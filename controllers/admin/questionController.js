// controllers/admin/questionController.js

const questionService = require('../../services/questionService');
const tcodeService = require('../../services/tcodeService');
const chapterService = require('../../services/chapterService');
const exerciseService = require('../../services/exerciseService');

exports.index = async (req, res) => {
  const { tcode, tcodeId, chapter, chapterId, exercise, exerciseId } = req.query;

  try {
    const questions = await questionService.getQuestionsForExercise(Number(exerciseId));

    res.render('question_master', {
      tcode,
      tcodeId,
      chapter,
      chapterId,
      exercise,
      exerciseId,
      questions
    });
  } catch (err) {
    req.flash('error', err.message);
    res.redirect('/admin/exercise');
  }
};

exports.create = async (req, res) => {
  const { exerciseId, title, filename, type, tcode, tcodeId, chapter, chapterId, exercise } = req.body;

  try {
    await questionService.createQuestion(Number(exerciseId), { title, filename, type });
    req.flash('success', 'Question created');
  } catch (err) {
    req.flash('error', err.message);
  }

  res.redirect(`/admin/question?tcode=${encodeURIComponent(tcode)}&tcodeId=${tcodeId}&chapter=${encodeURIComponent(chapter)}&chapterId=${chapterId}&exercise=${encodeURIComponent(exercise)}&exerciseId=${exerciseId}`);
};

exports.update = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { title, tcode, tcodeId, chapter, chapterId, exercise, exerciseId } = req.body;

  try {
    await questionService.updateQuestion(id, { title });
    req.flash('success', 'Question updated');
  } catch (err) {
    req.flash('error', err.message || 'Could not update question');
  }

  res.redirect(`/admin/question?tcode=${encodeURIComponent(tcode)}&tcodeId=${tcodeId}&chapter=${encodeURIComponent(chapter)}&chapterId=${chapterId}&exercise=${encodeURIComponent(exercise)}&exerciseId=${exerciseId}`);
};

exports.delete = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { tcode, tcodeId, chapter, chapterId, exercise, exerciseId } = req.query;

  try {
    await questionService.deleteQuestion(id);
    req.flash('success', 'Question deleted');
  } catch (err) {
    req.flash('error', err.message);
  }

  res.redirect(`/admin/question?tcode=${encodeURIComponent(tcode)}&tcodeId=${tcodeId}&chapter=${encodeURIComponent(chapter)}&chapterId=${chapterId}&exercise=${encodeURIComponent(exercise)}&exerciseId=${exerciseId}`);
};
