const User = require('../models/User');
const { error } = require('../utils/response');

/**
 * Middleware de autenticação demo.
 * Lê o header `x-demo-user` (valores aceitos: "teacher" | "student"),
 * carrega o usuário demo correspondente do banco e seta `req.user`.
 */
const demoAuth = async (req, res, next) => {
  try {
    const demoHeader = (req.headers['x-demo-user'] || '').toLowerCase().trim();

    if (!demoHeader || !['teacher', 'student'].includes(demoHeader)) {
      return error(
        res,
        'Header x-demo-user ausente ou inválido. Use "teacher" ou "student".',
        'UNAUTHORIZED',
        401
      );
    }

    const role = demoHeader === 'teacher' ? 'TEACHER' : 'STUDENT';
    const user = await User.findOne({ role, isDemo: true }).lean();

    if (!user) {
      return error(res, 'Usuário demo não encontrado. Execute o seed.', 'SEED_MISSING', 500);
    }

    req.user = { ...user, id: user._id.toString() };
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = demoAuth;
