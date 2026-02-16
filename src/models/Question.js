const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema(
  {
    classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    status: { type: String, enum: ['OPEN', 'ANSWERED', 'RESOLVED'], default: 'OPEN' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Question', questionSchema);
