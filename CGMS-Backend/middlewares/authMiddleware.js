// authmiddleware.js

const jwt = require('jsonwebtoken');
const User = require('../models/userModel'); // Adjust the path as necessary
const Department = require('../models/department'); // Adjust the path as necessary

const authenticate = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

    if (!token) return res.status(401).json({ message: "Access token missing" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);

        if (!user) return res.status(404).json({ message: "User not found" });

        // Initialize req.user with basic information
        req.user = { userId: user._id, role: user.role };

        // If the user is a department, fetch and attach department information
        if (user.role === 'Department') {
            const department = await Department.findOne({ username: user.username });

            if (!department) {
                return res.status(404).json({ message: "Department not found" });
            }

            // Attach department name to req.user
            req.user.department = department.name; // You can also use department._id if preferred
        }

        next();
    } catch (error) {
        console.error('Authentication error:', error);
        res.status(403).json({ message: "Invalid token" });
    }
};

module.exports = authenticate;
