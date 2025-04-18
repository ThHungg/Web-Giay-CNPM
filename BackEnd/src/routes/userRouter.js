const express = require("express");
const router = express.Router();
const userController = require('../controllers/userController');
const { authMiddleware, authUserMiddleware } = require("../middleware/authMiddleware");

router.post('/sign-up', userController.createUser);
router.post('/sign-in', userController.loginUser);
router.post('/log-out', userController.logoutUser);
router.put('/update-user/:id', authMiddleware, userController.updateUser);
router.put('/update-detail-user/:id', userController.updateDetailUser);
router.delete('/delete-user/:id', authMiddleware, userController.deleteUser);
router.get('/getAll', authMiddleware, userController.getAllUser);
router.get('/get-details/:id', userController.getDetailsUser);
router.post('/refresh-token', userController.refreshToken);
router.post('/reset-password', userController.sendOtp);
router.post('/verify-otp-reset-password', userController.verifyOtpAndResetPassword);

router.get('/', (req, res) => {
    res.status(200).json({ message: "User API is working!" });
});

module.exports = router;
