const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  thresholdPercentage: { type: Number, default: 60 },
  attainmentLevels: [{
    level: Number,
    minPercentage: Number,
    maxPercentage: Number
  }]
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);
