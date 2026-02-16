const User = require('../models/User');
const { success } = require('../utils/response');

/**
 * GET /demo/login?as=teacher|student
 * Retorna o usuário demo correspondente.
 */
const demoLogin = async (req, res, next) => {
  try {
    const { as: profile } = req.query;
    const role = profile === 'teacher' ? 'TEACHER' : 'STUDENT';

    const user = await User.findOne({ role, isDemo: true }).select('-__v');

    if (!user) {
      return res.status(500).json({
        error: { message: 'Usuário demo não encontrado. Execute o seed.', code: 'SEED_MISSING', details: [] },
      });
    }

    return success(
      res,
      {
        demoUser: profile,
        user,
      },
      200,
      { usage: 'Use o header  x-demo-user: teacher | student  em todas as requisições protegidas.' }
    );
  } catch (err) {
    next(err);
  }
};

module.exports = { demoLogin };
