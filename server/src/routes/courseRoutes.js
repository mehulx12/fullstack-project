const express = require('express');
const router = express.Router();
const { getCourses, createCourse, getMyCourses } = require('../controllers/courseController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', getCourses);
router.post('/', protect, authorize('INSTRUCTOR'), createCourse);
router.get('/my', protect, authorize('INSTRUCTOR'), getMyCourses);

module.exports = router;
