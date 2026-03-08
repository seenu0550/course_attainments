const express = require('express');
const router = express.Router();
const Marks = require('../models/Marks');
const Survey = require('../models/Survey');
const Course = require('../models/Course');

// Calculate CO-wise attainment
router.get('/:courseId', async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    const internalMarks = await Marks.find({ courseId: req.params.courseId, type: 'internal' });
    const externalMarks = await Marks.find({ courseId: req.params.courseId, type: 'external' });
    const surveys = await Survey.find({ courseId: req.params.courseId });

    const coAttainment = {};

    // Calculate for each CO
    const coNumbers = [...new Set([
      ...internalMarks.flatMap(m => m.coMarks.map(c => c.coNumber)),
      ...externalMarks.flatMap(m => m.coMarks.map(c => c.coNumber))
    ])];

    for (const coNum of coNumbers) {
      // Direct attainment (internal + external)
      let totalObtained = 0, totalMax = 0;

      internalMarks.forEach(mark => {
        const co = mark.coMarks.find(c => c.coNumber === coNum);
        if (co) {
          totalObtained += co.marksObtained;
          totalMax += co.maxMarks;
        }
      });

      externalMarks.forEach(mark => {
        const co = mark.coMarks.find(c => c.coNumber === coNum);
        if (co) {
          totalObtained += co.marksObtained;
          totalMax += co.maxMarks;
        }
      });

      const directPercentage = totalMax > 0 ? (totalObtained / totalMax) * 100 : 0;

      // Indirect attainment (survey)
      let totalRating = 0, ratingCount = 0;
      surveys.forEach(survey => {
        const co = survey.coRatings.find(c => c.coNumber === coNum);
        if (co) {
          totalRating += co.rating;
          ratingCount++;
        }
      });

      const indirectPercentage = ratingCount > 0 ? (totalRating / ratingCount / 5) * 100 : 0;

      // Combined attainment (80% direct + 20% indirect)
      const combinedPercentage = (directPercentage * 0.8) + (indirectPercentage * 0.2);

      // Determine level
      let level = 0;
      if (course.attainmentLevels && course.attainmentLevels.length > 0) {
        for (const lvl of course.attainmentLevels.sort((a, b) => a.level - b.level)) {
          if (combinedPercentage >= lvl.minPercentage && combinedPercentage <= lvl.maxPercentage) {
            level = lvl.level;
            break;
          }
        }
      } else {
        // Default levels
        if (combinedPercentage >= 75) level = 3;
        else if (combinedPercentage >= course.thresholdPercentage) level = 2;
        else if (combinedPercentage >= 40) level = 1;
      }

      coAttainment[`CO${coNum}`] = {
        directPercentage: directPercentage.toFixed(2),
        indirectPercentage: indirectPercentage.toFixed(2),
        combinedPercentage: combinedPercentage.toFixed(2),
        level
      };
    }

    res.json(coAttainment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
