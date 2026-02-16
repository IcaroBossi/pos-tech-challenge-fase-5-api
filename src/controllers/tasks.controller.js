const Task = require('../models/Task');
const { success, error } = require('../utils/response');

/* ────────── GET /tasks  (TEACHER) ──────────── */
const listTasks = async (req, res, next) => {
  try {
    const filter = { teacherId: req.user.id };
    if (req.query.classId) filter.classId = req.query.classId;
    if (req.query.status) filter.status = req.query.status;

    const tasks = await Task.find(filter).sort({ createdAt: -1 });
    return success(res, tasks);
  } catch (err) {
    next(err);
  }
};

/* ────────── POST /tasks  (TEACHER) ─────────── */
const createTask = async (req, res, next) => {
  try {
    const { title, description, classId, dueDate } = req.body;

    const task = await Task.create({
      teacherId: req.user.id,
      title,
      description: description || '',
      classId: classId || null,
      dueDate: dueDate ? new Date(dueDate) : null,
    });

    return success(res, task, 201);
  } catch (err) {
    next(err);
  }
};

/* ────────── PATCH /tasks/:taskId  (TEACHER) ── */
const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.taskId);
    if (!task) return error(res, 'Tarefa não encontrada.', 'NOT_FOUND', 404);
    if (task.teacherId.toString() !== req.user.id) {
      return error(res, 'Acesso negado a esta tarefa.', 'FORBIDDEN', 403);
    }

    const allowedFields = ['title', 'description', 'status', 'classId', 'dueDate'];
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        task[field] = field === 'dueDate' && req.body[field] ? new Date(req.body[field]) : req.body[field];
      }
    });

    await task.save();
    return success(res, task);
  } catch (err) {
    next(err);
  }
};

/* ────────── DELETE /tasks/:taskId  (TEACHER) ── */
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.taskId);
    if (!task) return error(res, 'Tarefa não encontrada.', 'NOT_FOUND', 404);
    if (task.teacherId.toString() !== req.user.id) {
      return error(res, 'Acesso negado a esta tarefa.', 'FORBIDDEN', 403);
    }

    await task.deleteOne();
    return success(res, { message: 'Tarefa removida com sucesso.' });
  } catch (err) {
    next(err);
  }
};

module.exports = { listTasks, createTask, updateTask, deleteTask };
