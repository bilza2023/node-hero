const express = require('express');
const router = express.Router();
const { uploadFile, uploadImage } = require('../controllers/uploadController');
const { uploadFile: fileMulter, uploadImage: imageMulter } = require('../config/multer');
const authenticate = require('../middleware/auth');
const { allow } = require('../middleware/role');

router.get('/upload/file', (req, res) => {
    res.render('uploadFile');
  });
// router.get('/upload/file', authenticate, (req, res) => res.render('uploadFile'));
router.get('/upload/image', authenticate, (req, res) => res.render('uploadImage'));

router.post('/upload/file', authenticate, allow('createOwn', 'file'), fileMulter.single('file'), uploadFile);
router.post('/upload/image', authenticate, allow('createOwn', 'image'), imageMulter.single('image'), uploadImage);

module.exports = router;
