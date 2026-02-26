const mongoose = require('mongoose');

const marksSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  type: { type: String, enum: ['internal', 'external'], required: true },
  coMarks: [{
    coNumber: Number,
    marksObtained: Number,
    maxMarks: Number
  }]
}, { timestamps: true });

module.exports = mongoose.model('Marks', marksSchema);
