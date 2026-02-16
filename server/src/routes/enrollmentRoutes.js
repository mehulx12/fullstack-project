const express = require('express');
const router = express.Router();
const { enrollInCourse, getMyEnrollments, getCourseEnrollments } = require('../controllers/enrollmentController');
const { protect, authorize } = require('../middleware/auth');

router.post('/:courseId', protect, authorize('STUDENT'), enrollInCourse);
router.get('/my', protect, authorize('STUDENT'), getMyEnrollments);
router.get('/course/:courseId', protect, authorize('INSTRUCTOR'), getCourseEnrollments);

module.exports = router;
