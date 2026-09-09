const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const newsletterController = require('../controllers/newsletterController');
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

router.get('/video/:filename', verifyTokenFromHeaderOrQuery, userController.getVideo);


module.exports = router;
