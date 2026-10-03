const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const newsletterController = require('../controllers/newsletterController');
const galleryController = require('../controllers/galleryController');
const serviceController = require('../controllers/serviceController');
const youtubeController = require('../controllers/youtubeController');
const { verifyTokenFromHeaderOrQuery } = require('../middleware/authMiddleware');

router.post('/newsletter', newsletterController.subscribe);

router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/user', userController.oneUser);
router.post('/course', userController.getOneCourse);
router.get('/courses', userController.getCourses);
router.post('/registercourse', userController.registerCourse);
router.get('/registercourses', userController.getRegisteredCourses);

router.post('/paid', userController.toggleRegisteredCoursePaid);

// Galéria publikus végpontok
router.get('/gallery', galleryController.getGallery);
router.get('/gallery/featured', galleryController.getFeaturedGallery);

// Szolgáltatások publikus végpontok
router.get('/services', serviceController.getServices);
router.get('/services/featured', serviceController.getFeaturedServices);

// YouTube videók és feed publikus végpont
router.get('/youtube/videos', youtubeController.getVideos);

router.get('/video/:filename', verifyTokenFromHeaderOrQuery, userController.getVideo);


module.exports = router;
