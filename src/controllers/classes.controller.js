const Class = require('../models/Class');
const ClassMember = require('../models/ClassMember');
const generateJoinCode = require('../utils/generateJoinCode');
const { success, error } = require('../utils/response');

/* ────────── POST /classes  (TEACHER) ────────── */
const createClass = async (req, res, next) => {
  try {
    const { name } = req.body;

    // Gera joinCode único
    let joinCode;
    let exists = true;
    while (exists) {
      joinCode = generateJoinCode(6);
      exists = await Class.findOne({ joinCode });
    }

    const newClass = await Class.create({
      name,
      teacherId: req.user.id,
      joinCode,
    });

    return success(res, newClass, 201);
  } catch (err) {
    next(err);
  }
};

/* ────────── GET /classes  (auth) ────────────── */
const listClasses = async (req, res, next) => {
  try {
    if (req.user.role === 'TEACHER') {
      const classes = await Class.find({ teacherId: req.user.id }).sort({ createdAt: -1 });
      return success(res, classes);
    }

    // STUDENT → turmas onde é membro
    const memberships = await ClassMember.find({ studentId: req.user.id }).select('classId');
    const classIds = memberships.map((m) => m.classId);
    const classes = await Class.find({ _id: { $in: classIds } }).sort({ createdAt: -1 });
    return success(res, classes);
  } catch (err) {
    next(err);
  }
};

/* ────────── POST /classes/join  (STUDENT) ───── */
const joinClass = async (req, res, next) => {
  try {
    const { joinCode } = req.body;
    const cls = await Class.findOne({ joinCode: joinCode.toUpperCase() });

    if (!cls) {
      return error(res, 'Turma não encontrada com esse joinCode.', 'NOT_FOUND', 404);
    }

    // Verifica se já é membro
    const alreadyMember = await ClassMember.findOne({ classId: cls._id, studentId: req.user.id });
    if (alreadyMember) {
      return error(res, 'Você já é membro desta turma.', 'ALREADY_MEMBER', 409);
    }

    await ClassMember.create({ classId: cls._id, studentId: req.user.id });

    return success(res, cls, 200, { message: 'Matrícula realizada com sucesso.' });
  } catch (err) {
    next(err);
  }
};

/* ────────── GET /classes/:classId  (auth) ───── */
const getClass = async (req, res, next) => {
  try {
    const cls = await Class.findById(req.params.classId);
    if (!cls) return error(res, 'Turma não encontrada.', 'NOT_FOUND', 404);

    if (req.user.role === 'TEACHER') {
      if (cls.teacherId.toString() !== req.user.id) {
        return error(res, 'Acesso negado a esta turma.', 'FORBIDDEN', 403);
      }
      return success(res, cls);
    }

    // STUDENT
    const isMember = await ClassMember.findOne({ classId: cls._id, studentId: req.user.id });
    if (!isMember) {
      return error(res, 'Você não é membro desta turma.', 'FORBIDDEN', 403);
    }
    return success(res, cls);
  } catch (err) {
    next(err);
  }
};

module.exports = { createClass, listClasses, joinClass, getClass };
