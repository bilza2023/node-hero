// controllers/admin/questionController.js

const questionService = require('../../services/questionService');

exports.index = async (req, res) => {
  const { tcode, tcodeId, chapter, chapterId, exercise, exerciseId, edit } = req.query;

  try {
    const questions = await questionService.getQuestionsForExercise(Number(exerciseId));

    let editQuestion = null;
    if (edit) {
      const id = parseInt(edit, 10);
      editQuestion = await questionService.getQuestionById(id);
    }

    res.render('question_master', {
      tcode,
      tcodeId,
      chapter,
      chapterId,
      exercise,
      exerciseId,
      questions,
      editQuestion
    });
  } catch (err) {
    req.flash('error', err.message);
    res.redirect('/admin/exercise');
  }
};

exports.create = async (req, res) => {
  const {
    exerciseId,
    title,
    filename,
    type,
    content,
    tcode,
    tcodeId,
    chapter,
    chapterId,
    exercise
  } = req.body;

  // ✅ Construct global filename
  const globalFilename = `${tcode}__${chapter}__${exercise}__${filename}`;

  try {
    await questionService.createQuestion(Number(exerciseId), {
      title,
      filename: globalFilename,
      type,
      content
    });
    req.flash('success', 'Question created');
  } catch (err) {
    req.flash('error', err.message);
  }

  res.redirect(
    `/admin/question?tcode=${encodeURIComponent(tcode)}&tcodeId=${tcodeId}` +
    `&chapter=${encodeURIComponent(chapter)}&chapterId=${chapterId}` +
    `&exercise=${encodeURIComponent(exercise)}&exerciseId=${exerciseId}`
  );
};


exports.update = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const {
    title,
    type,
    content,
    tcode,
    tcodeId,
    chapter,
    chapterId,
    exercise,
    exerciseId
  } = req.body;

  try {
    await questionService.updateQuestion(id, {
      title,
      type,
      content
    });
    req.flash('success', 'Question updated');
  } catch (err) {
    req.flash('error', err.message || 'Could not update question');
  }

  res.redirect(
    `/admin/question?tcode=${encodeURIComponent(tcode)}&tcodeId=${tcodeId}` +
    `&chapter=${encodeURIComponent(chapter)}&chapterId=${chapterId}` +
    `&exercise=${encodeURIComponent(exercise)}&exerciseId=${exerciseId}`
  );
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

  res.redirect(
    `/admin/question?tcode=${encodeURIComponent(tcode)}&tcodeId=${tcodeId}` +
    `&chapter=${encodeURIComponent(chapter)}&chapterId=${chapterId}` +
    `&exercise=${encodeURIComponent(exercise)}&exerciseId=${exerciseId}`
  );
};
