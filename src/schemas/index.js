const { z } = require('zod');

/* ────────────────────── helpers ────────────────────── */
const objectId = z.string().regex(/^[a-f\d]{24}$/i, 'ObjectId inválido');

/* ────────────────────── CLASSES ────────────────────── */
const createClassBody = z.object({
  name: z.string().min(1, 'Nome da turma é obrigatório').max(100),
});

const joinClassBody = z.object({
  joinCode: z.string().min(1, 'joinCode é obrigatório').max(10),
});

const classIdParam = z.object({
  classId: objectId,
});

/* ────────────────────── TASKS ──────────────────────── */
const createTaskBody = z.object({
  title: z.string().min(1, 'Título é obrigatório').max(200),
  description: z.string().max(2000).optional(),
  classId: objectId.optional().nullable(),
  dueDate: z.string().datetime({ offset: true }).optional().nullable(),
});

const updateTaskBody = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(2000).optional(),
  status: z.enum(['TODO', 'DOING', 'DONE']).optional(),
  classId: objectId.optional().nullable(),
  dueDate: z.string().datetime({ offset: true }).optional().nullable(),
});

const taskIdParam = z.object({
  taskId: objectId,
});

const taskQuery = z.object({
  classId: objectId.optional(),
  status: z.enum(['TODO', 'DOING', 'DONE']).optional(),
}).passthrough();

/* ────────────────────── QUESTIONS ──────────────────── */
const createQuestionBody = z.object({
  title: z.string().min(1, 'Título é obrigatório').max(200),
  description: z.string().min(1, 'Descrição é obrigatória').max(5000),
});

const updateQuestionBody = z.object({
  status: z.enum(['OPEN', 'ANSWERED', 'RESOLVED']),
});

const questionIdParam = z.object({
  questionId: objectId,
});

/* ────────────────────── REPLIES ────────────────────── */
const createReplyBody = z.object({
  content: z.string().min(1, 'Conteúdo é obrigatório').max(5000),
});

/* ────────────────────── DEMO AUTH ──────────────────── */
const demoLoginQuery = z.object({
  as: z.enum(['teacher', 'student'], { required_error: 'Query "as" é obrigatória (teacher|student)' }),
}).passthrough();

module.exports = {
  objectId,
  createClassBody,
  joinClassBody,
  classIdParam,
  createTaskBody,
  updateTaskBody,
  taskIdParam,
  taskQuery,
  createQuestionBody,
  updateQuestionBody,
  questionIdParam,
  createReplyBody,
  demoLoginQuery,
};
