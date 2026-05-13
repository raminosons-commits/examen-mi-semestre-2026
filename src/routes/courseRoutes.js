const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const courseController = require('../controllers/courseController');
const instructorController = require('../controllers/instructorController');
const enrollmentController = require('../controllers/enrollmentController');
const webhookController = require('../controllers/webhookController');

router.get('/courses', courseController.getAllCourses);
router.get('/courses/:id', courseController.getCourseById);
router.post('/courses', authMiddleware, courseController.createCourse);
router.put('/courses/:id', authMiddleware, courseController.updateCourse);
router.delete('/courses/:id', authMiddleware, courseController.deleteCourse);
router.post('/courses/:id/generate-description', authMiddleware, courseController.generateDescription);
router.get('/courses/:id/description', courseController.getDescription);

router.get('/instructors', instructorController.getAllInstructors);
router.post('/instructors', authMiddleware, instructorController.createInstructor);

router.post('/enrollments', authMiddleware, enrollmentController.createEnrollment);
router.patch('/enrollments/:id/complete', authMiddleware, enrollmentController.completeEnrollment);
router.get('/enrollments', authMiddleware, enrollmentController.getAllEnrollments);

router.post(
  '/webhooks/payment',
  express.raw({ type: 'application/json' }),
  (req, res, next) => {
    req.rawBody = req.body.toString('utf8');
    try {
      req.body = JSON.parse(req.rawBody);
    } catch (e) {
      return res.status(400).json({ success: false, message: 'JSON invalide' });
    }
    next();
  },
  webhookController.paymentWebhook
);

module.exports = router;