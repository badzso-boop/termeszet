const fs = require('fs');
const path = require('path');
const { execFile } = require('child_process');
const util = require('util');
const Gallery = require('../models/galleryModel');

const execFilePromise = util.promisify(execFile);

// Get all gallery images ordered by createdAt DESC
exports.getGallery = async (req, res) => {
  try {
    const images = await Gallery.findAll({
      order: [['createdAt', 'DESC']]
    });
    res.json(images);
  } catch (error) {
    console.error('Error fetching gallery images:', error);
    res.status(500).json({ error: 'generic.error' });
  }
};

// Get featured (starred) gallery images ordered by createdAt DESC
exports.getFeaturedGallery = async (req, res) => {
  try {
    const images = await Gallery.findAll({
      where: { isStarred: true },
      order: [['createdAt', 'DESC']],
      limit: 6
    });
    res.json(images);
  } catch (error) {
    console.error('Error fetching featured gallery images:', error);
    res.status(500).json({ error: 'generic.error' });
  }
};

// Upload single or multiple images and optimize with python script
exports.uploadImages = async (req, res) => {
  try {
    let files = [];
    if (req.files && Array.isArray(req.files)) {
      files = req.files;
    } else if (req.files && typeof req.files === 'object') {
      files = Object.values(req.files).flat();
    } else if (req.file) {
      files = [req.file];
    }

    if (files.length === 0) {
      return res.status(400).json({ error: 'gallery.noFiles' });
    }

    const uploadDir = path.join(process.cwd(), 'uploads', 'gallery');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const scriptPath = path.resolve(__dirname, '../../scripts/optimize_gallery_image.py');
    const createdImages = [];

    for (const file of files) {
      const filename = file.filename;
      const rawFilename = `raw-${filename}`;
      const optFilename = `opt-${filename}`;
      const thumbFilename = `thumb-${filename}`;

      const rawPath = path.join(uploadDir, rawFilename);
      const optPath = path.join(uploadDir, optFilename);
      const thumbPath = path.join(uploadDir, thumbFilename);

      // Move multer uploaded file to rawPath
      if (fs.existsSync(file.path)) {
        await fs.promises.rename(file.path, rawPath);
      }

      // Optimize via Python script
      try {
        await execFilePromise('python3', [
          scriptPath,
          '--input', rawPath,
          '--output', optPath,
          '--thumbnail', thumbPath
        ]);
      } catch (pyErr) {
        console.error(`Python optimization error for file ${filename}:`, pyErr);
        // Fallback: copy raw to optPath if optimization failed
        if (!fs.existsSync(optPath) && fs.existsSync(rawPath)) {
          await fs.promises.copyFile(rawPath, optPath);
        }
      }

      const optFileExists = fs.existsSync(optPath);
      const thumbFileExists = fs.existsSync(thumbPath);
      const finalSize = optFileExists ? (await fs.promises.stat(optPath)).size : file.size;

      const title = req.body.title || (file.originalname ? path.parse(file.originalname).name : null);
      const isStarred = req.body.isStarred === true || req.body.isStarred === 'true';

      const galleryRecord = await Gallery.create({
        title: title,
        filename: filename,
        originalUrl: `/uploads/gallery/${optFilename}`,
        thumbnailUrl: thumbFileExists ? `/uploads/gallery/${thumbFilename}` : `/uploads/gallery/${optFilename}`,
        isStarred: isStarred,
        size: finalSize
      });

      createdImages.push(galleryRecord);
    }

    res.status(201).json(createdImages);
  } catch (error) {
    console.error('Error in uploadImages:', error);
    res.status(500).json({ error: 'gallery.uploadFailed' });
  }
};

// Toggle isStarred status for an image
exports.toggleStar = async (req, res) => {
  const { id } = req.params;
  const imageId = id || req.body.id;

  try {
    const image = await Gallery.findByPk(imageId);
    if (!image) {
      return res.status(404).json({ error: 'gallery.imageNotFound' });
    }

    image.isStarred = !image.isStarred;
    await image.save();

    res.json({ message: 'gallery.starUpdated', image });
  } catch (error) {
    console.error('Error toggling star status:', error);
    res.status(500).json({ error: 'generic.error' });
  }
};

// Update image details (title, isStarred)
exports.updateImage = async (req, res) => {
  const { id } = req.params;
  const imageId = id || req.body.id;
  const { title, isStarred } = req.body;

  try {
    const image = await Gallery.findByPk(imageId);
    if (!image) {
      return res.status(404).json({ error: 'gallery.imageNotFound' });
    }

    if (title !== undefined) {
      image.title = title;
    }
    if (isStarred !== undefined) {
      image.isStarred = isStarred === true || isStarred === 'true' || isStarred === 1 || isStarred === '1';
    }

    await image.save();
    res.json({ message: 'gallery.imageUpdated', image });
  } catch (error) {
    console.error('Error updating gallery image:', error);
    res.status(500).json({ error: 'generic.error' });
  }
};

// Delete gallery image and its files from disk
exports.deleteImage = async (req, res) => {
  const { id } = req.params;
  const imageId = id || req.body.id;

  try {
    const image = await Gallery.findByPk(imageId);
    if (!image) {
      return res.status(404).json({ error: 'gallery.imageNotFound' });
    }

    const uploadDir = path.join(process.cwd(), 'uploads', 'gallery');
    const filesToDelete = new Set();

    if (image.filename) {
      filesToDelete.add(path.join(uploadDir, image.filename));
      filesToDelete.add(path.join(uploadDir, `raw-${image.filename}`));
      filesToDelete.add(path.join(uploadDir, `opt-${image.filename}`));
      filesToDelete.add(path.join(uploadDir, `thumb-${image.filename}`));
    }

    if (image.originalUrl && image.originalUrl.startsWith('/uploads/gallery/')) {
      const cleanPath = image.originalUrl.replace(/^\//, '');
      filesToDelete.add(path.join(process.cwd(), cleanPath));
    }

    if (image.thumbnailUrl && image.thumbnailUrl.startsWith('/uploads/gallery/')) {
      const cleanPath = image.thumbnailUrl.replace(/^\//, '');
      filesToDelete.add(path.join(process.cwd(), cleanPath));
    }

    for (const filePath of filesToDelete) {
      try {
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      } catch (err) {
        console.error(`Error deleting file ${filePath}:`, err);
      }
    }

    await image.destroy();
    res.json({ message: 'gallery.imageDeleted' });
  } catch (error) {
    console.error('Error deleting gallery image:', error);
    res.status(500).json({ error: 'generic.error' });
  }
};
