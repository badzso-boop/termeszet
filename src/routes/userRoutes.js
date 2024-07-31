const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/user', userController.oneUser);
router.post('/course', userController.getOneCourse);
router.get('/courses', userController.getCourses);
router.get('/video/:filename', userController.getVideo);


module.exports = router;
