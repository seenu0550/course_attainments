const mongoose = require('mongoose');

const surveySchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  coRatings: [{
    coNumber: Number,
    rating: { type: Number, min: 1, max: 5 }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Survey', surveySchema);
