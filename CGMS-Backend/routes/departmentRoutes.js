const express = require('express');
const router = express.Router();
const departmentController = require('../controllers/departmentController');
const authenticate = require('../middlewares/authMiddleware');


router.get('/grievances', authenticate, departmentController.getAssignedGrievances);
router.put('/grievances/:id', authenticate,departmentController.updateGrievanceStatus);

module.exports = router;
