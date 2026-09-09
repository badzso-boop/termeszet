const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

// Minden admin route JWT-hitelesítést + admin jogosultságot igényel. A router.use()
// biztosítja, hogy ez bármelyik jelenlegi/jövőbeli route elé kerüljön -- a
// fájlfeltöltés (multer) ezért mindig EZUTÁN fut, nem előtte, így nem íródik lemezre
// fájl azelőtt, hogy a kérő admin jogosultságát ellenőriztük volna.
router.use(verifyToken, verifyAdmin);

// Felhasználók kezelése
router.post('/users', adminController.getUsers);
router.put('/updateuser', adminController.updateUser);
router.delete('/deleteUser', adminController.deleteUser);
router.post('/createUser', adminController.createUser);

// Házifeladatok kezelése
router.post('/homeworks', adminController.getHomeworks);
router.post('/createUserHW', adminController.createUserHomework);
router.put('/updateUserHW', adminController.updateUserHomework);
router.delete('/deleteUserHW', adminController.deleteUserHomework);

router.post('/registercourses', adminController.registerCourses);
router.post('/toggleregistercourse', adminController.toggleRegisteredCourse);
router.post('/adminpaid', adminController.toggleRegisteredCourseAdminPaid);
router.post('/deleteregistercourse', adminController.deleteRegisteredCourse);

// Minikurzusok kezelése
router.post('/courses', adminController.getCourses);
router.post('/createCourse', upload.single('video'), adminController.createCourse);
router.put('/updateCourse', upload.single('video'), adminController.updateCourse);
router.delete('/deleteCourse', adminController.deleteCourse);

// Leckék kezelése (egy kurzushoz tartozó, sorrendezett video+szöveg blokkok)
router.post('/lessons', adminController.getLessons);
router.post('/createLesson', upload.single('video'), adminController.createLesson);
router.put('/updateLesson', upload.single('video'), adminController.updateLesson);
router.delete('/deleteLesson', adminController.deleteLesson);

module.exports = router;
