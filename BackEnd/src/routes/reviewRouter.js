const express = require("express");
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { authMiddleware } = require("../middleware/authMiddleware");

router.post("/addReview", reviewController.addReview);
router.get("/getReview/:productId", reviewController.getReviewsProduct);
router.delete('/deleteReview/:reviewId', authMiddleware, reviewController.deleteReview);

module.exports = router;     


