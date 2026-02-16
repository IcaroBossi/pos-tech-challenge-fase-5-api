const { error } = require('../utils/response');

/**
 * Fábrica de middleware de RBAC.
 * @param  {...string} allowedRoles  ex: 'TEACHER', 'STUDENT'
 */
const roles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return error(res, 'Não autenticado.', 'UNAUTHORIZED', 401);
    }
    if (!allowedRoles.includes(req.user.role)) {
      return error(res, 'Acesso negado para o seu perfil.', 'FORBIDDEN', 403);
    }
    next();
  };
};

module.exports = roles;
