const express = require('express');
const router = express.Router();
const fs = require('fs');

router.get('/gallery', (req, res) => {
  const allUploads = JSON.parse(fs.readFileSync('./data/fileUploads.json', 'utf-8'));
  const images = allUploads.filter(u => u.type === 'image');
  res.render('gallery', { images });
});

module.exports = router;
