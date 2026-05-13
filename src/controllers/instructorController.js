const Instructor = require('../models/Instructor');
const { success, error } = require('../utils/apiResponse');

exports.getAllInstructors = async (req, res, next) => {
  try {
    const instructors = await Instructor.findAll();
    return success(res, instructors, 'Liste des formateurs', 200);
  } catch (err) {
    next(err);
  }
};

exports.createInstructor = async (req, res, next) => {
  try {
    const { name, email, specialty } = req.body;
    if (!name || !email || !specialty) {
      return error(res, 'Validation échouée', 422, {
        name: !name ? ['Nom requis'] : [],
        email: !email ? ['Email requis'] : [],
        specialty: !specialty ? ['Spécialité requise'] : []
      });
    }

    const instructor = await Instructor.create({ name, email, specialty });
    return success(res, instructor, 'Formateur créé', 201);
  } catch (err) {
    next(err);
  }
};