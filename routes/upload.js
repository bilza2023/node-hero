const express = require('express');
const router = express.Router();
const { uploadFile, uploadImage } = require('../controllers/uploadController');
const { uploadFile: fileMulter, uploadImage: imageMulter } = require('../config/multer');
// const authenticate = require('../middleware/auth');

// Views (no auth needed)
router.get('/upload/file', (req, res) => res.render('uploadFile'));
router.get('/upload/image', (req, res) => res.render('uploadImage'));


// Upload routes (auth only — no roles)
router.post('/upload/file', fileMulter.single('file'), uploadFile);
router.post('/upload/image', imageMulter.single('image'), uploadImage);

module.exports = router;
