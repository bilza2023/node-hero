const multer = require('multer');
const path = require('path');
const { fileUploadPath, imageUploadPath } = require('./paths');

// Allowed extensions for general files
const allowedFileExts = ['.pdf', '.docx', '.doc', '.txt', '.zip','.md', '.csv'];

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedFileExts.includes(ext)) cb(null, true);
  else cb(new Error('Unsupported file type: ' + ext));
};

// File storage
const fileStorage = multer.diskStorage({
  destination: fileUploadPath,
  filename: (req, file, cb) => {
    const name = `${Date.now()}_${file.originalname}`;
    cb(null, name);
  }
});

// Image storage
const imageStorage = multer.diskStorage({
  destination: imageUploadPath,
  filename: (req, file, cb) => {
    const name = `${Date.now()}_${file.originalname}`;
    cb(null, name);
  }
});

const imageFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (['.jpg', '.jpeg', '.png'].includes(ext)) cb(null, true);
  else cb(new Error('Only images are allowed'));
};

module.exports = {
  uploadFile: multer({ storage: fileStorage, fileFilter }),
  uploadImage: multer({ storage: imageStorage, fileFilter: imageFilter })
};
