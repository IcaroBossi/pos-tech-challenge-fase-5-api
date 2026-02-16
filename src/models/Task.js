const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', default: null },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '', trim: true },
    status: { type: String, enum: ['TODO', 'DOING', 'DONE'], default: 'TODO' },
    dueDate: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Task', taskSchema);
