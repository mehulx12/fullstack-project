const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

const registerUser = async (req, res) => {
    const { name, email, password, role } = req.body;
    try {
        if (await User.findOne({ email })) return res.status(400).json({ message: 'User exists' });
        const user = await User.create({ name, email, password, role });
        res.status(201).json({
            _id: user.id, name: user.name, email: user.email, role: user.role, token: generateToken(user.id)
        });
    } catch (e) { res.status(500).json({ message: e.message }); }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user.id, name: user.name, email: user.email, role: user.role, token: generateToken(user.id)
            });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (e) { res.status(500).json({ message: e.message }); }
};

module.exports = { registerUser, loginUser };
