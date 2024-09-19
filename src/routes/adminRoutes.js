const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

// Felhasználók kezelése
router.post('/users', verifyAdmin, adminController.getUsers);
router.put('/updateuser', verifyAdmin, adminController.updateUser);
router.delete('/deleteUser', verifyAdmin, adminController.deleteUser);
router.post('/createUser', verifyAdmin, adminController.createUser);

// Házifeladatok kezelése
router.post('/homeworks', verifyAdmin, adminController.getHomeworks);
router.post('/createUserHW', verifyAdmin, adminController.createUserHomework);
router.put('/updateUserHW', verifyAdmin, adminController.updateUserHomework);
router.delete('/deleteUserHW', verifyAdmin, adminController.deleteUserHomework);

router.post('/registercourses', verifyAdmin, adminController.registerCourses);
router.post('/toggleregistercourse', verifyAdmin, adminController.toggleRegisteredCourse);
router.post('/adminpaid', verifyAdmin, adminController.toggleRegisteredCourseAdminPaid);
router.post('/deleteregistercourse', verifyAdmin, adminController.deleteRegisteredCourse);

// Minikurzusok kezelése
router.post('/courses', verifyAdmin, adminController.getCourses);
router.post('/createCourse', upload.single('video'), verifyAdmin, adminController.createCourse);
router.put('/updateCourse', upload.single('video'), verifyAdmin, adminController.updateCourse);
router.delete('/deleteCourse', verifyAdmin, adminController.deleteCourse);

module.exports = router;
