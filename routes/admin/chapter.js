const express = require('express');
const router = express.Router();
const chapterController = require('../../controllers/admin/chapterController');

// ✅ List chapters / show form
router.get('/', chapterController.index);

// ✅ Create must come BEFORE :id, or it will be captured as an ID
router.post('/create', chapterController.create);

// ✅ Update by chapter ID
router.post('/:id', chapterController.update);

// ✅ Delete by chapter ID
router.post('/:id/delete', chapterController.delete);

module.exports = router;
