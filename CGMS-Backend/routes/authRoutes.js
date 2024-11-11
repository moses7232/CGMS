const express=require('express');
const {register,login,sendVerificationCode,verifyCode,getUserProfile,submitGrievance,trackGrievanceByCode,getUserGrievances,updateUserProfile,submitFeedback} = require('../controllers/authControllers');
const authenticate = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/request-verification',sendVerificationCode);
router.post('/verify-code',verifyCode);
router.get('/user/profile',authenticate,getUserProfile);
router.post('/grievances',authenticate,submitGrievance);
router.get('/fetch-grievances',authenticate,getUserGrievances);
router.get('/fetch-anonymous-grievances/:trackingCode',trackGrievanceByCode);
router.put('/user/profile',authenticate,updateUserProfile);
router.post('/submit-feedback',submitFeedback);
module.exports = router;