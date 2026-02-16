const mongoose = require('mongoose');

const classSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    joinCode: { type: String, required: true, unique: true, uppercase: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Class', classSchema);
