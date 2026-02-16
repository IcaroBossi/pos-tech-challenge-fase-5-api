const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const errorHandler = require('./middlewares/errorHandler');

/* ────────── Routes ────────── */
const demoAuthRoutes = require('./routes/demoAuth.routes');
const classesRoutes = require('./routes/classes.routes');
const tasksRoutes = require('./routes/tasks.routes');
const questionsRoutes = require('./routes/questions.routes');

const app = express();

/* ────────── Global middlewares ────────── */
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

/* ────────── Health check ────────── */
app.get('/health', (_req, res) => {
  res.json({ data: { status: 'ok', timestamp: new Date().toISOString() } });
});

/* ────────── API routes ────────── */
app.use('/demo', demoAuthRoutes);
app.use('/classes', classesRoutes);
app.use('/tasks', tasksRoutes);
app.use('/', questionsRoutes);          // monta em / porque as rotas já têm prefixo completo

/* ────────── 404 ────────── */
app.use((_req, res) => {
  res.status(404).json({
    error: { message: 'Rota não encontrada.', code: 'NOT_FOUND', details: [] },
  });
});

/* ────────── Error handler centralizado ────────── */
app.use(errorHandler);

module.exports = app;
