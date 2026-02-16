/**
 * Padroniza respostas de sucesso.
 * @param {import('express').Response} res
 * @param {any} data
 * @param {number} statusCode
 * @param {object|null} meta
 */
const success = (res, data, statusCode = 200, meta = undefined) => {
  const body = { data };
  if (meta) body.meta = meta;
  return res.status(statusCode).json(body);
};

/**
 * Padroniza respostas de erro.
 * @param {import('express').Response} res
 * @param {string} message
 * @param {string} code
 * @param {number} statusCode
 * @param {Array} details
 */
const error = (res, message, code = 'INTERNAL_ERROR', statusCode = 500, details = []) => {
  return res.status(statusCode).json({
    error: { message, code, details },
  });
};

module.exports = { success, error };
