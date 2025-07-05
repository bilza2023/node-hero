// routes/admin/uploadContent.js

const express = require('express');
const router = express.Router();
const controller = require('../../controllers/admin/uploadContentController');

// GET: show page with import button
router.get('/', controller.index);

// POST: run import and show results
router.post('/', controller.importFiles);

module.exports = router;
