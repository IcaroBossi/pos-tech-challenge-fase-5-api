const { ZodError } = require('zod');
const { error } = require('../utils/response');

/**
 * Fábrica de middleware de validação via Zod.
 * @param {{ body?: import('zod').ZodSchema, query?: import('zod').ZodSchema, params?: import('zod').ZodSchema }} schemas
 */
const validate = (schemas) => {
  return (req, res, next) => {
    try {
      if (schemas.body) {
        req.body = schemas.body.parse(req.body);
      }
      if (schemas.query) {
        req.query = schemas.query.parse(req.query);
      }
      if (schemas.params) {
        req.params = schemas.params.parse(req.params);
      }
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const details = err.errors.map((e) => ({
          path: e.path.join('.'),
          message: e.message,
        }));
        return error(res, 'Dados de entrada inválidos.', 'VALIDATION_ERROR', 400, details);
      }
      next(err);
    }
  };
};

module.exports = validate;
