const Class = require('../models/Class');
const ClassMember = require('../models/ClassMember');
const Question = require('../models/Question');
const QuestionReply = require('../models/QuestionReply');
const { success, error } = require('../utils/response');

/* ═══════════════════ helpers ═══════════════════ */

/**
 * Verifica se o usuário tem acesso à turma.
 * Retorna a turma ou null.
 */
const checkClassAccess = async (classId, user) => {
  const cls = await Class.findById(classId);
  if (!cls) return null;

  if (user.role === 'TEACHER') {
    return cls.teacherId.toString() === user.id ? cls : null;
  }

  // STUDENT → deve ser membro
  const member = await ClassMember.findOne({ classId: cls._id, studentId: user.id });
  return member ? cls : null;
};

/**
 * Verifica se o usuário tem acesso à turma da question.
 */
const checkQuestionAccess = async (questionId, user) => {
  const question = await Question.findById(questionId);
  if (!question) return { question: null, cls: null };

  const cls = await checkClassAccess(question.classId, user);
  return { question, cls };
};

/* ═══════════════ QUESTIONS ═════════════════════ */

/* ── GET /classes/:classId/questions ──────────── */
const listQuestions = async (req, res, next) => {
  try {
    const cls = await checkClassAccess(req.params.classId, req.user);
    if (!cls) return error(res, 'Turma não encontrada ou acesso negado.', 'FORBIDDEN', 403);

    const questions = await Question.find({ classId: cls._id })
      .populate('studentId', 'name email')
      .sort({ createdAt: -1 });

    return success(res, questions);
  } catch (err) {
    next(err);
  }
};

/* ── POST /classes/:classId/questions (STUDENT) ─ */
const createQuestion = async (req, res, next) => {
  try {
    const cls = await checkClassAccess(req.params.classId, req.user);
    if (!cls) return error(res, 'Turma não encontrada ou você não é membro.', 'FORBIDDEN', 403);

    const question = await Question.create({
      classId: cls._id,
      studentId: req.user.id,
      title: req.body.title,
      description: req.body.description,
    });

    return success(res, question, 201);
  } catch (err) {
    next(err);
  }
};

/* ── PATCH /questions/:questionId ────────────── */
const updateQuestion = async (req, res, next) => {
  try {
    const { question, cls } = await checkQuestionAccess(req.params.questionId, req.user);
    if (!question) return error(res, 'Dúvida não encontrada.', 'NOT_FOUND', 404);
    if (!cls) return error(res, 'Acesso negado a esta dúvida.', 'FORBIDDEN', 403);

    const { status } = req.body;

    if (req.user.role === 'STUDENT') {
      // Aluno só pode marcar como RESOLVED se for o autor
      if (status !== 'RESOLVED') {
        return error(res, 'Aluno só pode marcar como RESOLVED.', 'FORBIDDEN', 403);
      }
      if (question.studentId.toString() !== req.user.id) {
        return error(res, 'Apenas o autor da dúvida pode resolvê-la.', 'FORBIDDEN', 403);
      }
    }

    if (req.user.role === 'TEACHER') {
      if (!['ANSWERED', 'OPEN'].includes(status)) {
        return error(res, 'Professor pode definir status como ANSWERED ou OPEN.', 'VALIDATION_ERROR', 400);
      }
    }

    question.status = status;
    await question.save();

    return success(res, question);
  } catch (err) {
    next(err);
  }
};

/* ═══════════════ REPLIES ═══════════════════════ */

/* ── POST /questions/:questionId/replies (TEACHER) */
const createReply = async (req, res, next) => {
  try {
    const { question, cls } = await checkQuestionAccess(req.params.questionId, req.user);
    if (!question) return error(res, 'Dúvida não encontrada.', 'NOT_FOUND', 404);
    if (!cls) return error(res, 'Acesso negado. Turma não pertence a você.', 'FORBIDDEN', 403);

    const reply = await QuestionReply.create({
      questionId: question._id,
      teacherId: req.user.id,
      content: req.body.content,
    });

    // Atualiza status da question para ANSWERED
    question.status = 'ANSWERED';
    await question.save();

    return success(res, reply, 201);
  } catch (err) {
    next(err);
  }
};

/* ── GET /questions/:questionId/replies ────────── */
const listReplies = async (req, res, next) => {
  try {
    const { question, cls } = await checkQuestionAccess(req.params.questionId, req.user);
    if (!question) return error(res, 'Dúvida não encontrada.', 'NOT_FOUND', 404);
    if (!cls) return error(res, 'Acesso negado.', 'FORBIDDEN', 403);

    const replies = await QuestionReply.find({ questionId: question._id })
      .populate('teacherId', 'name email')
      .sort({ createdAt: 1 });

    return success(res, replies);
  } catch (err) {
    next(err);
  }
};

module.exports = { listQuestions, createQuestion, updateQuestion, createReply, listReplies };
