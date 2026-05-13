const { Op } = require('sequelize');
const Student = require('../models/Student');
const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const { success, error } = require('../utils/apiResponse');

exports.getAllStudents = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page || '1', 10);
    const perPage = parseInt(req.query.per_page || '15', 10);
    const name = req.query.name || '';

    const where = {};
    if (name) where.name = { [Op.like]: `%${name}%` };

    const { count, rows } = await Student.findAndCountAll({
      where,
      limit: perPage,
      offset: (page - 1) * perPage,
      order: [['created_at', 'DESC']]
    });

    return success(res, rows, 'Liste des étudiants', 200, {
      total: count,
      current_page: page,
      last_page: Math.ceil(count / perPage),
      per_page: perPage
    });
  } catch (err) {
    next(err);
  }
};

exports.createStudent = async (req, res, next) => {
  try {
    const { name, email, phone, enrolled_at } = req.body;
    if (!name || !email) {
      return error(res, 'Validation échouée', 422, {
        name: !name ? ['Le nom est requis'] : [],
        email: !email ? ['L’email est requis'] : []
      });
    }

    const student = await Student.create({ name, email, phone, enrolled_at });
    return success(res, student, 'Étudiant créé', 201);
  } catch (err) {
    next(err);
  }
};

exports.getStudentById = async (req, res, next) => {
  try {
    const student = await Student.findByPk(req.params.id, {
      include: [{
        model: Enrollment,
        include: [Course]
      }]
    });

    if (!student) return error(res, 'Étudiant non trouvé', 404);
    return success(res, student, 'Détail étudiant', 200);
  } catch (err) {
    next(err);
  }
};

exports.updateStudent = async (req, res, next) => {
  try {
    const student = await Student.findByPk(req.params.id);
    if (!student) return error(res, 'Étudiant non trouvé', 404);

    await student.update(req.body);
    return success(res, student, 'Étudiant mis à jour', 200);
  } catch (err) {
    next(err);
  }
};

exports.deleteStudent = async (req, res, next) => {
  try {
    const student = await Student.findByPk(req.params.id);
    if (!student) return error(res, 'Étudiant non trouvé', 404);

    await student.destroy();
    return res.status(204).send();
  } catch (err) {
    next(err);
  }
};