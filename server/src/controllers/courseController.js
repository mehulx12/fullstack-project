const Course = require('../models/Course');

const getCourses = async (req, res) => {
    try {
        const courses = await Course.find().populate('instructor', 'name email');
        res.json(courses);
    } catch (e) { res.status(500).json({ message: e.message }); }
};

const createCourse = async (req, res) => {
    const { title, description, startDate } = req.body;
    try {
        const course = await Course.create({
            title, description, startDate, instructor: req.user.id
        });
        res.status(201).json(course);
    } catch (e) { res.status(500).json({ message: e.message }); }
};

const getMyCourses = async (req, res) => {
    try {
        const courses = await Course.find({ instructor: req.user.id });
        res.json(courses);
    } catch (e) { res.status(500).json({ message: e.message }); }
};

module.exports = { getCourses, createCourse, getMyCourses };
