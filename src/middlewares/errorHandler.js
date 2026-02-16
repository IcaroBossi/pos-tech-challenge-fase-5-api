const { NODE_ENV } = require('../config/env');

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, _req, res, _next) => {
  console.error('💥  Error:', err);

  const statusCode = err.statusCode || 500;
  const message = NODE_ENV === 'production' ? 'Erro interno do servidor.' : err.message;

  res.status(statusCode).json({
    error: {
      message,
      code: err.code || 'INTERNAL_ERROR',
      details: err.details || [],
    },
  });
};

module.exports = errorHandler;
