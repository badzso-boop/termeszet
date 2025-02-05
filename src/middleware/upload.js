const multer = require('multer');
const path = require('path');

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Directory to store uploaded files
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Save file with unique name
  }
});

// Configure multer
const upload = multer({
  storage: storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // Set file size limit to 100MB
  fileFilter: function (req, file, cb) {
    const allowedMimeTypes = ['video/mp4', 'video/x-matroska', 'video/x-msvideo', 'audio/mpeg'];
    const allowedExtensions = /mp4|mkv|avi|mp3/;

    const isMimeTypeAllowed = allowedMimeTypes.includes(file.mimetype);
    const isExtensionAllowed = allowedExtensions.test(path.extname(file.originalname).toLowerCase());

    if (isMimeTypeAllowed && isExtensionAllowed) {
      return cb(null, true);
    }

    cb(new Error('Only MP4, MKV, AVI videos, and MP3 audio files are allowed.'));
  }
});

module.exports = upload;
