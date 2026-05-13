const { error } = require('../utils/apiResponse');

module.exports = (err, req, res, next) => {
  if (err.name === 'SequelizeValidationError') {
    const errors = {};
    err.errors.forEach(e => {
      if (!errors[e.path]) errors[e.path] = [];
      errors[e.path].push(e.message);
    });
    return error(res, 'Validation échouée', 422, errors);
  }

  if (err.name === 'SequelizeUniqueConstraintError') {
    const errors = {};
    err.errors.forEach(e => {
      if (!errors[e.path]) errors[e.path] = [];
      errors[e.path].push('Valeur déjà utilisée.');
    });
    return error(res, 'Validation échouée', 422, errors);
  }

  return error(res, err.message || 'Erreur serveur', err.statusCode || 500);
};