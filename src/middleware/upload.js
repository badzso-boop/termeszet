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
    const filetypes = /mp4|mkv|avi/; // Allowed file types
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only videos are allowed'));
  }
});

module.exports = upload;
