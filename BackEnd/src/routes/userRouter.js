const express = require("express");
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/', userController.createUser);

router.get('/', (req, res) => {
    res.status(200).json({ message: "User API is working!" });
});

module.exports = router;
