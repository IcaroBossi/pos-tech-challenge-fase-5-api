const { Router } = require('express');
const demoAuth = require('../middlewares/demoAuth');
const roles = require('../middlewares/roles');
const validate = require('../middlewares/validate');
const { createClassBody, joinClassBody, classIdParam } = require('../schemas');
const ctrl = require('../controllers/classes.controller');

const router = Router();

// Todas as rotas de classes requerem autenticação
router.use(demoAuth);

// POST /classes  — TEACHER cria turma
router.post('/', roles('TEACHER'), validate({ body: createClassBody }), ctrl.createClass);

// GET /classes   — TEACHER: suas turmas | STUDENT: turmas onde é membro
router.get('/', ctrl.listClasses);

// POST /classes/join  — STUDENT entra via joinCode
router.post('/join', roles('STUDENT'), validate({ body: joinClassBody }), ctrl.joinClass);

// GET /classes/:classId
router.get('/:classId', validate({ params: classIdParam }), ctrl.getClass);

module.exports = router;
