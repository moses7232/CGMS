const Grievance = require('../models/grievanceModel');


exports.getAssignedGrievances = async (req, res) => {
  try {
      const { department, role } = req.user;

      if (role !== 'Department') {
          return res.status(403).json({ message: 'Access denied. Not a department user.' });
      }

      if (!department) {
          return res.status(400).json({ message: 'Department information is missing.' });
      }

      const grievances = await Grievance.find({ department: department });

      res.status(200).json(grievances);
  } catch (error) {
      console.error('Error fetching assigned grievances:', error);
      res.status(500).json({ message: 'Failed to fetch grievances', error: error.message });
  }
};


exports.updateGrievanceStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, resolutionNote } = req.body;
    
    const grievance = await Grievance.findByIdAndUpdate(
      id,
      { status, resolutionNote, updatedAt: new Date() },
      { new: true }
    );

    if (!grievance) {
      return res.status(404).json({ message: 'Grievance not found' });
    }

    res.status(200).json({ message: 'Grievance updated successfully', grievance });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update grievance', error });
  }
};
