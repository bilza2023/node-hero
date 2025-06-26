const path = require('path');
const fs = require('fs');
const { fileUploadPath, imageUploadPath } = require('../config/paths');

function uploadFile(req, res) {
  if (!req.file) return res.status(400).send('No file uploaded');

  const uploads = JSON.parse(fs.readFileSync('./data/fileUploads.json', 'utf-8'));
  uploads.push({
    name: req.file.filename,
    original: req.file.originalname,
    type: 'file',
    uploader: req.user.email,
    uploadedAt: new Date().toISOString()
  });
  fs.writeFileSync('./data/fileUploads.json', JSON.stringify(uploads, null, 2));

  res.send('File uploaded successfully');
}

function uploadImage(req, res) {
  if (!req.file) return res.status(400).send('No image uploaded');

  const uploads = JSON.parse(fs.readFileSync('./data/fileUploads.json', 'utf-8'));
  uploads.push({
    name: req.file.filename,
    original: req.file.originalname,
    type: 'image',
    uploader: req.user.email,
    uploadedAt: new Date().toISOString()
  });
  fs.writeFileSync('./data/fileUploads.json', JSON.stringify(uploads, null, 2));

  res.send('Image uploaded successfully');
}

module.exports = { uploadFile, uploadImage };
