const { Op } = require('sequelize');
const Enrollment = require('../models/Enrollment');
const Student = require('../models/Student');
const Course = require('../models/Course');
const { success, error } = require('../utils/apiResponse');

exports.createEnrollment = async (req, res, next) => {
  try {
    const { student_id, course_id } = req.body;
    if (!student_id || !course_id) {
      return error(res, 'Validation échouée', 422, {
        student_id: !student_id ? ['student_id requis'] : [],
        course_id: !course_id ? ['course_id requis'] : []
      });
    }

    const student = await Student.findByPk(student_id);
    const course = await Course.findByPk(course_id);
    if (!student || !course) return error(res, 'Étudiant ou cours introuvable', 404);

    const existing = await Enrollment.findOne({ where: { student_id, course_id } });
    if (existing) return error(res, 'Cet étudiant est déjà inscrit à ce cours', 409);

    const enrollment = await Enrollment.create({
      student_id,
      course_id,
      status: 'pending',
      payment_status: 'unpaid'
    });

    return success(res, enrollment, 'Inscription créée', 201);
  } catch (err) {
    next(err);
  }
};

exports.completeEnrollment = async (req, res, next) => {
  try {
    const enrollment = await Enrollment.findByPk(req.params.id);
    if (!enrollment) return error(res, 'Enrollment non trouvé', 404);

    enrollment.status = 'completed';
    await enrollment.save();

    return success(res, enrollment, 'Enrollment complété', 200);
  } catch (err) {
    next(err);
  }
};

exports.getAllEnrollments = async (req, res, next) => {
  try {
    const { status, payment_status } = req.query;
    const where = {};
    if (status) where.status = status;
    if (payment_status) where.payment_status = payment_status;

    const enrollments = await Enrollment.findAll({
      where,
      include: [Student, Course]
    });

    return success(res, enrollments, 'Liste des enrollments', 200);
  } catch (err) {
    next(err);
  }
};