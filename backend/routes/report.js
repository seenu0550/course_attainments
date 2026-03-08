const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const Student = require('../models/Student');
const Marks = require('../models/Marks');
const Survey = require('../models/Survey');

// Generate full report
router.get('/:courseId', async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    const students = await Student.find({ courseId: req.params.courseId });
    const internalMarks = await Marks.find({ courseId: req.params.courseId, type: 'internal' }).populate('studentId');
    const externalMarks = await Marks.find({ courseId: req.params.courseId, type: 'external' }).populate('studentId');
    const surveys = await Survey.find({ courseId: req.params.courseId }).populate('studentId');

    // Get attainment calculation
    const attainmentResponse = await fetch(`http://localhost:${process.env.PORT || 5000}/api/attainment/${req.params.courseId}`);
    const attainment = await attainmentResponse.json();

    const report = {
      course: {
        code: course.code,
        name: course.name,
        threshold: course.thresholdPercentage
      },
      totalStudents: students.length,
      coAttainment: attainment,
      studentDetails: students.map(student => {
        const internal = internalMarks.find(m => m.studentId._id.toString() === student._id.toString());
        const external = externalMarks.find(m => m.studentId._id.toString() === student._id.toString());
        const survey = surveys.find(s => s.studentId._id.toString() === student._id.toString());

        return {
          rollNumber: student.rollNumber,
          name: student.name,
          internal: internal?.coMarks || [],
          external: external?.coMarks || [],
          survey: survey?.coRatings || []
        };
      })
    };

    res.json(report);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
