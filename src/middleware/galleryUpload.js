const multer = require('multer');
const path = require('path');
const fs = require('fs');
const apiError = require('../helpers/apiError');

const uploadDir = path.join(process.cwd(), 'uploads', 'gallery');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage for gallery uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + ext);
  }
});

// Configure multer
const galleryUpload = multer({
  storage: storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB
  fileFilter: function (req, file, cb) {
    const allowedExtensions = /\.(jpe?g|png|webp|gif|heic|heif)$/i;
    const allowedMimeTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/gif',
      'image/heic',
      'image/heif',
      'image/heic-sequence',
      'image/heif-sequence'
    ];

    const isExtAllowed = allowedExtensions.test(path.extname(file.originalname).toLowerCase());
    const isMimeAllowed = allowedMimeTypes.includes(file.mimetype.toLowerCase()) || file.mimetype.startsWith('image/');

    if (isExtAllowed || isMimeAllowed) {
      return cb(null, true);
    }

    cb(apiError('upload.invalidImageType'));
  }
});

module.exports = galleryUpload;
