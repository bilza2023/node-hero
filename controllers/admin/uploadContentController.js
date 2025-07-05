
// controllers/uploadContentController.js

const { importQuestionContentFromFiles } = require('../../services/contentImportService');

exports.index = (req, res) => {
  res.render('uploadContent', { result: null });
};

exports.importFiles = async (req, res) => {
  try {
    const result = await importQuestionContentFromFiles('data/content');
    res.render('uploadContent', { result });
  } catch (err) {
    res.status(500).send('Error during content import: ' + err.message);
  }
};
