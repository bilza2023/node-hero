// routes/admin/question.js

const express = require('express');
const router = express.Router();
const controller = require('../../controllers/admin/questionController');

router.get('/', controller.index);                       // Show question list + add form
router.post('/create', controller.create);               // Create a new question
router.post('/:id', controller.update);                  // Update a question
router.post('/:id/delete', controller.delete);           // Delete a question

module.exports = router;
