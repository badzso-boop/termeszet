const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');

// Felhasználók kezelése
router.get('/users', verifyAdmin, adminController.getUsers);
router.put('/updateUser', verifyAdmin, adminController.updateUser);
router.delete('/deleteUser', verifyAdmin, adminController.deleteUser);
router.post('/createUser', verifyAdmin, adminController.createUser);

// Házifeladatok kezelése
router.post('/createUserHW', verifyAdmin, adminController.createUserHomework);
router.put('/updateUserHW', verifyAdmin, adminController.updateUserHomework);
router.delete('/deleteUserHW', verifyAdmin, adminController.deleteUserHomework);

// Minikurzusok kezelése
router.post('/createCourse', verifyAdmin, adminController.createCourse);
router.put('/updateCourse', verifyAdmin, adminController.updateCourse);
router.delete('/deleteCourse', verifyAdmin, adminController.deleteCourse);

module.exports = router;
