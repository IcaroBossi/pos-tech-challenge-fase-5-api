const { Router } = require('express');
const demoAuth = require('../middlewares/demoAuth');
const roles = require('../middlewares/roles');
const validate = require('../middlewares/validate');
const {
  classIdParam,
  createQuestionBody,
  updateQuestionBody,
  questionIdParam,
  createReplyBody,
} = require('../schemas');
const ctrl = require('../controllers/questions.controller');

const router = Router();

// Todas as rotas de questions requerem autenticação
router.use(demoAuth);

/* ───── Dúvidas dentro de uma turma ───── */

// GET /classes/:classId/questions
router.get(
  '/classes/:classId/questions',
  validate({ params: classIdParam }),
  ctrl.listQuestions
);

// POST /classes/:classId/questions  (STUDENT)
router.post(
  '/classes/:classId/questions',
  roles('STUDENT'),
  validate({ params: classIdParam, body: createQuestionBody }),
  ctrl.createQuestion
);

/* ───── Operações em question específica ───── */

// PATCH /questions/:questionId
router.patch(
  '/questions/:questionId',
  validate({ params: questionIdParam, body: updateQuestionBody }),
  ctrl.updateQuestion
);

/* ───── Replies ───── */

// POST /questions/:questionId/replies  (TEACHER)
router.post(
  '/questions/:questionId/replies',
  roles('TEACHER'),
  validate({ params: questionIdParam, body: createReplyBody }),
  ctrl.createReply
);

// GET /questions/:questionId/replies
router.get(
  '/questions/:questionId/replies',
  validate({ params: questionIdParam }),
  ctrl.listReplies
);

module.exports = router;
