const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');

const enrollInCourse = async (req, res) => {
    const { courseId } = req.params;
    try {
        const course = await Course.findById(courseId);
        if (!course) return res.status(404).json({ message: 'Course not found' });

        if (new Date() > new Date(course.startDate)) {
            return res.status(400).json({ message: 'Enrollment failed: Course has already started.' });
        }

        if (await Enrollment.findOne({ student: req.user.id, course: courseId })) {
            return res.status(400).json({ message: 'Already enrolled' });
        }

        const enrollment = await Enrollment.create({ student: req.user.id, course: courseId });
        res.status(201).json(enrollment);
    } catch (e) { res.status(500).json({ message: e.message }); }
};

const getMyEnrollments = async (req, res) => {
    try {
        const enrollments = await Enrollment.find({ student: req.user.id })
            .populate({ path: 'course', populate: { path: 'instructor', select: 'name' } });
        res.json(enrollments);
    } catch (e) { res.status(500).json({ message: e.message }); }
};

const getCourseEnrollments = async (req, res) => {
    try {
        const enrollments = await Enrollment.find({ course: req.params.courseId }).populate('student', 'name email');
        res.json(enrollments);
    } catch (e) { res.status(500).json({ message: e.message }); }
};

module.exports = { enrollInCourse, getMyEnrollments, getCourseEnrollments };
