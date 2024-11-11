const Grievance = require('../models/grievanceModel');
const User = require('../models/userModel');
const Department = require('../models/department');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');

const getGrievanceStats = async (req, res) => {
  try {
    const pending = await Grievance.countDocuments({ status: 'Pending' });
    const inProgress = await Grievance.countDocuments({ status: 'In Progress' });
    const resolved = await Grievance.countDocuments({ status: 'Resolved' });

    const recentGrievances = await Grievance.find().sort({ createdAt: -1 }).limit(5);

    res.json({ pending, inProgress, resolved, recentGrievances });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch grievance stats.' });
  }
};

const getUserCount = async (req, res) => {
  try {
    const count = await User.countDocuments();
    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user count.' });
  }
};

const getAllGrievances = async (req, res) => {
  try {
    const grievances = await Grievance.find();
    res.json(grievances);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch grievances.' });
  }
};

const filterGrievances = async (req, res) => {
  const { status, category } = req.query;
  const filter = {};

  if (status) filter.status = status;
  if (category) filter.category = category;

  try {
    const grievances = await Grievance.find(filter);
    res.json(grievances);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch filtered grievances.' });
  }
};


const updateGrievanceStatus = async (req, res) => {
  const { grievanceId } = req.params;
  const { status, department, resolvedNote } = req.body;

  try {
    // Ensure the status is valid
    if (!['Pending', 'In Progress', 'Resolved'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status provided.' });
    }

    // Prepare update data
    const updateData = { status, updatedAt: Date.now() };

    // Add department if status is "In Progress"
    if (status === 'In Progress') {
      if (!department) {
        return res.status(400).json({ error: 'Department is required when marking as In Progress.' });
      }
      updateData.department = department;
    }

    // Add resolution note if status is "Resolved"
    if (status === 'Resolved') {
      if (!resolvedNote) {
        return res.status(400).json({ error: 'Resolution note is required when marking as Resolved.' });
      }
      updateData.resolutionNote = resolvedNote;
    }

    // Update the grievance and set updatedAt to the current date
    const updatedGrievance = await Grievance.findByIdAndUpdate(
      grievanceId,
      updateData, // Update with status, department, and/or resolution note
      { new: true } // Return the updated document
    );

    if (!updatedGrievance) {
      return res.status(404).json({ error: 'Grievance not found.' });
    }

    res.json(updatedGrievance);
  } catch (error) {
    console.error('Error updating grievance status:', error);
    res.status(500).json({ error: 'Failed to update grievance status.' });
  }
};

const createDepartment = async (req, res) => {
  const { name, email, username, password } = req.body;
  try {
    const department = new Department({ name, email, username, password });
    await department.save();

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const departmentUser = new User({
      username,
      email,
      passwordHash,
      role: 'Department', // Assign role as "Department"
      verified: true, // Assuming departments are verified by default
    });
    await departmentUser.save();

    res.status(201).json({ message: 'Department created successfully', department });


  } catch (error) {
    console.error('Error creating department:', error);
    res.status(500).json({ error: 'Failed to create department' });
  }
};

const sendDepartmentEmail = async (req, res) => {
  const { to, subject, text } = req.body;
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
};

const fetchDepartments = async (req, res) => {
  try {
    const departments = await Department.find({});
    res.status(200).json(departments);
  } catch (error) {
    console.error('Error fetching departments:', error);
    res.status(500).json({ error: 'Failed to fetch departments.' });
  }
};


// Route to get average feedback rating by department
const fetchFeedbackStats = async (req, res) => {
  try {
    const feedbackStats = await Grievance.aggregate([
      { $match: { status: 'Resolved', 'feedback.rating': { $exists: true } } }, // Filter for resolved grievances with feedback
      {
        $group: {
          _id: '$department', // Group by department
          averageRating: { $avg: '$feedback.rating' }, // Calculate average rating
          count: { $sum: 1 }, // Count of grievances with feedback
        },
      },
      { $sort: { averageRating: -1 } }, // Optional: Sort by highest average rating
    ]);

    res.json(feedbackStats);
  } catch (error) {
    console.error('Error fetching feedback stats:', error);
    res.status(500).json({ message: 'Failed to retrieve feedback statistics.' });
  }
};

module.exports = {
  getGrievanceStats, getUserCount,
  getAllGrievances, filterGrievances, updateGrievanceStatus,
  createDepartment, sendDepartmentEmail, fetchDepartments,
  fetchFeedbackStats
};