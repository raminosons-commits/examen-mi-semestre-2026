const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const studentController = require('../controllers/studentController');

router.get('/students', authMiddleware, studentController.getAllStudents);
router.post('/students', authMiddleware, studentController.createStudent);
router.get('/students/:id', authMiddleware, studentController.getStudentById);
router.put('/students/:id', authMiddleware, studentController.updateStudent);
router.delete('/students/:id', authMiddleware, studentController.deleteStudent);

module.exports = router;