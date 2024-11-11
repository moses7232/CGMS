const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const Grievance = require('../models/grievanceModel');
const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid'); // For generating unique tracking codes

const register = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        user = new User({ username, email, passwordHash });
        await user.save();

        res.status(201).json({ message: "User register successfully" });
    }
    catch (error) {
        res.status(500).json({ error: "Server error" });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }
        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid password" });
        }

        const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '5h' });
        res.status(200).json({ token, role: user.role });
    }
    catch (error) {
        res.status(500).json({ error: 'server error' });
    }
}

const sendVerificationCode = async (req, res) => {
    const { email } = req.body;
    const code = Math.floor(100000 + Math.random() * 900000).toString(); // Generate 6-digit code
    const codeExpiry = Date.now() + 2 * 60 * 1000; // Code expires in 10 minutes

    try {
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        // Send email
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Your Verification Code for CGMS Account',
            text: `Hello,
        
        Thank you for signing up with the Centralized Grievance Management System (CGMS)!
        
        Please use the following verification code to complete your account setup:
        
        Verification Code: ${code}
        
        This code will expire in 10 minutes. If you did not request this code, please ignore this email.
        
        Thank you for being part of CGMS!
        
        Best regards,
        CGMS Team`,
        });


        // Save code and expiry to user record
        await User.updateOne(
            { email },
            { $set: { verificationCode: code, codeExpiry: new Date(codeExpiry) } }
        );

        res.status(200).json({ message: 'Verification code sent' });
    } catch (error) {
        console.error('Error sending verification email:', error);
        res.status(500).json({ error: 'Failed to send verification email' });
    }
};

const verifyCode = async (req, res) => {
    const { email, enteredCode } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        // Check if the code matches and is not expired
        if (user.verificationCode === enteredCode && user.codeExpiry > Date.now()) {
            // Update user's verified status and clear verification code fields
            user.verified = true;
            user.verificationCode = undefined;
            user.codeExpiry = undefined;
            await user.save();

            res.status(200).json({ message: 'Account verified successfully!' });
        } else {
            res.status(400).json({ message: 'Invalid or expired verification code' });
        }
    } catch (error) {
        console.error('Error verifying code:', error);
        res.status(500).json({ error: 'Server error during verification' });
    }
};

const getUserProfile = async (req, res) => {
    try {
        // Fetch user details including verified status, username, and email
        const user = await User.findById(req.user.userId, 'username email verified');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Respond with the necessary user details for profile display
        res.status(200).json({
            username: user.username,
            email: user.email,
            verified: user.verified,
        });
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ message: 'Server error. Failed to retrieve profile information.' });
    }
};

const updateUserProfile = async (req, res) => {
    const { email, username } = req.body;

    try {
        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.email = email || user.email;
        user.username = username || user.username;
        await user.save();

        res.status(200).json({ message: 'Profile updated successfully' });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ error: 'Server error. Failed to update profile.' });
    }
};


const submitGrievance = async (req, res) => {
    const { description, category, isAnonymous } = req.body;

    try {
        const grievanceData = {
            description,
            category,
            isAnonymous,
            status: 'Pending',
            createdAt: new Date(),
        };

        if (!isAnonymous) {
            const user = await User.findById(req.user.userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            grievanceData.userId = user._id;
            grievanceData.username = user.username;
            grievanceData.email = user.email;
        } else {
            // Only generate trackingCode if anonymous
            grievanceData.trackingCode = uuidv4();
        }

        const grievance = new Grievance(grievanceData);
        await grievance.save();

        res.status(201).json({
            message: 'Grievance submitted successfully!',
            ...(isAnonymous && { trackingCode: grievanceData.trackingCode }),
        });
    } catch (error) {
        console.error('Error submitting grievance:', error);
        res.status(500).json({ message: 'Failed to submit grievance.' });
    }
};



// Function to get user grievances
const getUserGrievances = async (req, res) => {
    try {
        const userId = req.user.userId; // Get user ID from the token

        // Fetch user details based on userId
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Fetch grievances for the user based on username and email
        const grievances = await Grievance.find({ userId: userId });
        res.json(grievances);

    } catch (error) {
        console.error('Error fetching grievances:', error);
        res.status(500).json({ message: 'Failed to fetch grievances.' });
    }
};

// Example of tracking a grievance by tracking code
const trackGrievanceByCode = async (req, res) => {
    console.log("Hello");
    const { trackingCode } = req.params;
    console.log(trackingCode);
    try {
        const grievance = await Grievance.findOne({ trackingCode });
        if (!grievance) {
            return res.status(404).json({ message: 'Grievance not found.' });
        }
        res.json(grievance);
    } catch (error) {
        console.error('Error tracking grievance:', error);
        res.status(500).json({ message: 'Failed to track grievance.' });
    }
};


const submitFeedback = async (req, res) => {
    const { grievanceId, rating, comment } = req.body;
    console.log('Received data:', { grievanceId, rating, comment });

    try {
        const grievance = await Grievance.findById(grievanceId);
        if (!grievance) {
            return res.status(404).json({ message: 'Grievance not found.' });
        }

        // Update feedback fields
        grievance.feedback = { rating, comment };
        await grievance.save();

        res.status(200).json({ message: 'Feedback submitted successfully.' });
    } catch (error) {
        console.error('Error submitting feedback:', error);
        res.status(500).json({ message: 'Failed to submit feedback.' });
    }
};

module.exports = {
    register,
    login,
    sendVerificationCode,
    verifyCode,
    getUserProfile,
    submitGrievance,
    trackGrievanceByCode,
    getUserGrievances,
    updateUserProfile,
    submitFeedback
};