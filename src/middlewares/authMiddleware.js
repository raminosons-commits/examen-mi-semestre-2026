const jwt = require('jsonwebtoken');
const { error } = require('../utils/apiResponse');

module.exports = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return error(res, 'Requête non authentifiée', 401);
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.auth = { userId: decoded.id, email: decoded.email };
    next();
  } catch (err) {
    return error(res, 'Token invalide ou expiré', 401);
  }
};