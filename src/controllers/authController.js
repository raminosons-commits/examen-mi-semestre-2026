const jwt = require('jsonwebtoken');
const Student = require('../models/Student');
const { success, error } = require('../utils/apiResponse');

exports.login = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return error(res, 'Validation échouée', 422, { email: ['Email requis'] });

    const student = await Student.findOne({ where: { email } });
    if (!student) return error(res, 'Utilisateur non trouvé', 401);

    const token = jwt.sign(
      { id: student.id, email: student.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    return success(res, { token }, 'Connexion réussie', 200);
  } catch (err) {
    return error(res, 'Erreur serveur', 500);
  }
};