const express = require("express");
const router = express.Router();
const userController = require('../controllers/userController');
const { authMiddleware, authUserMiddleware } = require("../middleware/authMiddleware");

router.post('/sign-up', userController.createUser);
router.post('/sign-in', userController.loginUser);
router.put('/update-user/:id', userController.updateUser);
router.delete('/delete-user/:id', authMiddleware, userController.deleteUser);
router.get('/getAll', authMiddleware, userController.getAllUser);
router.get('/get-details/:id', userController.getDetailsUser);
router.post('/refresh-token', userController.refreshToken);

router.get('/', (req, res) => {
    res.status(200).json({ message: "User API is working!" });
});

module.exports = router;
