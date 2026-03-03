const express = require('express');
const router = express.Router();
const multer = require('multer');
const xlsx = require('xlsx');
const Student = require('../models/Student');
const Marks = require('../models/Marks');
const Survey = require('../models/Survey');

const upload = multer({ dest: 'uploads/' });

// Upload internal marks
router.post('/internal/:courseId', upload.single('file'), async (req, res) => {
  try {
    const workbook = xlsx.readFile(req.file.path);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = xlsx.utils.sheet_to_json(sheet);

    for (const row of data) {
      let student = await Student.findOne({ rollNumber: row.rollNumber });
      if (!student) {
        student = new Student({
          rollNumber: row.rollNumber,
          name: row.name,
          courseId: req.params.courseId
        });
        await student.save();
      }

      const coMarks = [];
      for (const key in row) {
        if (key.startsWith('CO')) {
          const coNumber = parseInt(key.replace('CO', ''));
          coMarks.push({
            coNumber,
            marksObtained: row[key],
            maxMarks: row[`${key}_max`] || 100
          });
        }
      }

      await Marks.findOneAndUpdate(
        { studentId: student._id, courseId: req.params.courseId, type: 'internal' },
        { coMarks },
        { upsert: true }
      );
    }

    res.json({ message: 'Internal marks uploaded successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Upload external marks
router.post('/external/:courseId', upload.single('file'), async (req, res) => {
  try {
    const workbook = xlsx.readFile(req.file.path);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = xlsx.utils.sheet_to_json(sheet);

    for (const row of data) {
      const student = await Student.findOne({ rollNumber: row.rollNumber });
      if (!student) continue;

      const coMarks = [];
      for (const key in row) {
        if (key.startsWith('CO')) {
          const coNumber = parseInt(key.replace('CO', ''));
          coMarks.push({
            coNumber,
            marksObtained: row[key],
            maxMarks: row[`${key}_max`] || 100
          });
        }
      }

      await Marks.findOneAndUpdate(
        { studentId: student._id, courseId: req.params.courseId, type: 'external' },
        { coMarks },
        { upsert: true }
      );
    }

    res.json({ message: 'External marks uploaded successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Upload survey
router.post('/survey/:courseId', upload.single('file'), async (req, res) => {
  try {
    const workbook = xlsx.readFile(req.file.path);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = xlsx.utils.sheet_to_json(sheet);

    for (const row of data) {
      const student = await Student.findOne({ rollNumber: row.rollNumber });
      if (!student) continue;

      const coRatings = [];
      for (const key in row) {
        if (key.startsWith('CO')) {
          const coNumber = parseInt(key.replace('CO', ''));
          coRatings.push({
            coNumber,
            rating: row[key]
          });
        }
      }

      await Survey.findOneAndUpdate(
        { studentId: student._id, courseId: req.params.courseId },
        { coRatings },
        { upsert: true }
      );
    }

    res.json({ message: 'Survey data uploaded successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
