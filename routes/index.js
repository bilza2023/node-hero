const express = require('express');
const router = express.Router();
const fs = require('fs');
const authenticate = require('../middleware/auth');

router.get('/', (req, res) => {
  res.render('home');
});

router.get('/uploads', authenticate, (req, res) => {
  const uploads = JSON.parse(fs.readFileSync('./data/fileUploads.json', 'utf-8'));
  res.render('uploadsList', { uploads });
});

module.exports = router;
