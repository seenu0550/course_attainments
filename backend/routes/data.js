const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const Marks = require('../models/Marks');
const Survey = require('../models/Survey');

// Get all students for a course
router.get('/students/:courseId', async (req, res) => {
  try {
    const students = await Student.find({ courseId: req.params.courseId });
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all marks for a course
router.get('/marks/:courseId', async (req, res) => {
  try {
    const marks = await Marks.find({ courseId: req.params.courseId }).populate('studentId');
    res.json(marks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get survey data for a course
router.get('/survey/:courseId', async (req, res) => {
  try {
    const surveys = await Survey.find({ courseId: req.params.courseId }).populate('studentId');
    res.json(surveys);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
