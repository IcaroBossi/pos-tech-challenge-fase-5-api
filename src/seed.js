/**
 * Seed script — cria dados demo obrigatórios.
 * Executado automaticamente antes do start no Docker.
 *
 * Dados criados:
 *  - 1 TEACHER demo (professor@demo.com / professor123)
 *  - 1 STUDENT demo (aluno@demo.com / aluno123)
 *  - 2 turmas do professor: "9ºA" e "8ºB"
 *  - Student matriculado na turma "9ºA"
 *  - 2 tasks do professor (uma geral e uma vinculada à 9ºA)
 *  - 1 question do aluno na turma "9ºA"
 */

require('dotenv').config();
const mongoose = require('mongoose');
const { MONGO_URI } = require('./config/env');

const User = require('./models/User');
const Class = require('./models/Class');
const ClassMember = require('./models/ClassMember');
const Task = require('./models/Task');
const Question = require('./models/Question');

const seed = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('🌱  Seed: conectado ao MongoDB');

    /* ── Verifica se já foi "seedado" ── */
    const existingTeacher = await User.findOne({ email: 'professor@demo.com' });
    if (existingTeacher) {
      console.log('🌱  Seed: dados demo já existem — pulando.');
      await mongoose.disconnect();
      return;
    }

    /* ── Users ── */
    const teacher = await User.create({
      name: 'Professor Demo',
      email: 'professor@demo.com',
      password: 'professor123',
      role: 'TEACHER',
      isDemo: true,
    });

    const student = await User.create({
      name: 'Aluno Demo',
      email: 'aluno@demo.com',
      password: 'aluno123',
      role: 'STUDENT',
      isDemo: true,
    });

    console.log('🌱  Seed: usuários demo criados');

    /* ── Classes ── */
    const class9A = await Class.create({
      name: '9ºA',
      teacherId: teacher._id,
      joinCode: 'TURMA1',
    });

    const class8B = await Class.create({
      name: '8ºB',
      teacherId: teacher._id,
      joinCode: 'TURMA2',
    });

    console.log('🌱  Seed: turmas criadas —', class9A.name, class8B.name);

    /* ── ClassMember — aluno matriculado na 9ºA ── */
    await ClassMember.create({
      classId: class9A._id,
      studentId: student._id,
    });

    console.log('🌱  Seed: aluno matriculado na turma', class9A.name);

    /* ── Tasks ── */
    await Task.create({
      teacherId: teacher._id,
      title: 'Preparar plano de aula semanal',
      description: 'Definir conteúdos e atividades para a próxima semana.',
      status: 'TODO',
    });

    await Task.create({
      teacherId: teacher._id,
      classId: class9A._id,
      title: 'Corrigir provas do 9ºA',
      description: 'Corrigir e lançar notas da avaliação bimestral.',
      status: 'DOING',
    });

    console.log('🌱  Seed: tarefas do professor criadas');

    /* ── Question ── */
    await Question.create({
      classId: class9A._id,
      studentId: student._id,
      title: 'Dúvida sobre equações do 2º grau',
      description: 'Professor, não entendi como usar a fórmula de Bhaskara quando o delta é negativo. Pode explicar?',
      status: 'OPEN',
    });

    console.log('🌱  Seed: dúvida do aluno criada na turma', class9A.name);

    console.log('✅  Seed concluído com sucesso!');
    await mongoose.disconnect();
  } catch (err) {
    console.error('❌  Seed error:', err);
    process.exit(1);
  }
};

seed();
