const { Router } = require('express');
const demoAuth = require('../middlewares/demoAuth');
const roles = require('../middlewares/roles');
const validate = require('../middlewares/validate');
const { createTaskBody, updateTaskBody, taskIdParam, taskQuery } = require('../schemas');
const ctrl = require('../controllers/tasks.controller');

const router = Router();

// Todas as rotas de tasks são exclusivas de TEACHER
router.use(demoAuth, roles('TEACHER'));

// GET /tasks?classId=&status=
router.get('/', validate({ query: taskQuery }), ctrl.listTasks);

// POST /tasks
router.post('/', validate({ body: createTaskBody }), ctrl.createTask);

// PATCH /tasks/:taskId
router.patch('/:taskId', validate({ params: taskIdParam, body: updateTaskBody }), ctrl.updateTask);

// DELETE /tasks/:taskId
router.delete('/:taskId', validate({ params: taskIdParam }), ctrl.deleteTask);

module.exports = router;
