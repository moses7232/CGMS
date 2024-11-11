const express = require('express');
const { getGrievanceStats, getUserCount,getAllGrievances,filterGrievances,updateGrievanceStatus,createDepartment,sendDepartmentEmail,fetchDepartments ,fetchFeedbackStats} = require('../controllers/adminControllers');
const router = express.Router();

router.get('/grievance-stats', getGrievanceStats);
router.get('/user-count', getUserCount);
router.get('/grievances', getAllGrievances);
router.get('/grievances/filter', filterGrievances);
router.put('/grievances/:grievanceId', updateGrievanceStatus);
router.post('/createDepartment',createDepartment);
router.post('/sendEmail',sendDepartmentEmail);
router.get('/departments',fetchDepartments);
router.get('/feedback-stats',fetchFeedbackStats);

module.exports = router;
