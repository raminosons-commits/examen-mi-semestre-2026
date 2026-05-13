const { Op } = require('sequelize');
const Course = require('../models/Course');
const Instructor = require('../models/Instructor');
const Enrollment = require('../models/Enrollment');
const { success, error } = require('../utils/apiResponse');

exports.getAllCourses = async (req, res, next) => {
  try {
    const { instructor_id, sort = 'price', direction = 'asc' } = req.query;
    const where = {};
    if (instructor_id) where.instructor_id = instructor_id;

    const courses = await Course.findAll({
      where,
      order: [[sort, direction.toUpperCase()]],
      include: [{ model: Instructor }]
    });

    return success(res, courses, 'Liste des cours', 200);
  } catch (err) {
    next(err);
  }
};

exports.getCourseById = async (req, res, next) => {
  try {
    const course = await Course.findByPk(req.params.id, {
      include: [Instructor, Enrollment]
    });

    if (!course) return error(res, 'Cours non trouvé', 404);

    const nbEnrollments = await Enrollment.count({ where: { course_id: course.id } });
    const data = course.toJSON();
    data.nb_enrollments = nbEnrollments;

    return success(res, data, 'Détail du cours', 200);
  } catch (err) {
    next(err);
  }
};

exports.createCourse = async (req, res, next) => {
  try {
    const { title, description, price, duration_hours, instructor_id } = req.body;
    if (!title || price == null || !duration_hours || !instructor_id) {
      return error(res, 'Validation échouée', 422, {
        title: !title ? ['Le titre est requis'] : [],
        price: price == null ? ['Le prix est requis'] : [],
        duration_hours: !duration_hours ? ['La durée est requise'] : [],
        instructor_id: !instructor_id ? ['Le formateur est requis'] : []
      });
    }

    const course = await Course.create({ title, description, price, duration_hours, instructor_id });
    return success(res, course, 'Cours créé', 201);
  } catch (err) {
    next(err);
  }
};

exports.updateCourse = async (req, res, next) => {
  try {
    const course = await Course.findByPk(req.params.id);
    if (!course) return error(res, 'Cours non trouvé', 404);

    await course.update(req.body);
    return success(res, course, 'Cours mis à jour', 200);
  } catch (err) {
    next(err);
  }
};

exports.deleteCourse = async (req, res, next) => {
  try {
    const course = await Course.findByPk(req.params.id);
    if (!course) return error(res, 'Cours non trouvé', 404);

    const activeEnrollments = await Enrollment.count({
      where: {
        course_id: course.id,
        status: { [Op.in]: ['pending', 'active'] }
      }
    });

    if (activeEnrollments > 0) {
      return error(res, 'Suppression impossible : des enrollments actifs existent', 422);
    }

    await course.destroy();
    return res.status(204).send();
  } catch (err) {
    next(err);
  }
};

exports.generateDescription = async (req, res, next) => {
  try {
    const course = await Course.findByPk(req.params.id, { include: [Instructor] });
    if (!course) return error(res, 'Cours non trouvé', 404);

    if (course.generated_description) {
      return success(res, { description: course.generated_description }, 'Description existante', 200);
    }

    const OpenAI = require('openai');
    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      baseURL: process.env.OPENAI_BASE_URL
    });

    const prompt = `Tu es un expert en marketing de formation. Tu rédiges des descriptions courtes et percutantes pour des pages de cours en ligne. Réponds uniquement en français. Maximum 4 phrases.

Génère une description marketing pour ce cours :
Titre : ${course.title}
Durée : ${course.duration_hours} heures
Formateur spécialisé en : ${course.Instructor?.specialty || ''}`;

    let result;
    try {
      result = await client.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'Tu es un expert en marketing de formation. Tu rédiges des descriptions courtes et percutantes pour des pages de cours en ligne. Réponds uniquement en français. Maximum 4 phrases.' },
          { role: 'user', content: `Génère une description marketing pour ce cours :\nTitre : ${course.title}\nDurée : ${course.duration_hours} heures\nFormateur spécialisé en : ${course.Instructor?.specialty || ''}` }
        ]
      });
    } catch (e) {
      return error(res, 'OpenAI indisponible', 503);
    }

    const description = result.choices?.[0]?.message?.content?.trim();
    if (!description) return error(res, 'OpenAI indisponible', 503);

    course.generated_description = description;
    await course.save();

    return success(res, { description }, 'Description générée', 200);
  } catch (err) {
    next(err);
  }
};

exports.getDescription = async (req, res, next) => {
  try {
    const course = await Course.findByPk(req.params.id);
    if (!course) return error(res, 'Cours non trouvé', 404);
    if (!course.generated_description) return error(res, 'Description absente', 404);

    return success(res, { description: course.generated_description }, 'Description du cours', 200);
  } catch (err) {
    next(err);
  }
};