const reviewService = require("../services/reviewService");

const addReview = async (req, res) => {
    try {
        const { userId, productId, comment, rating } = req.body;
        const response = await reviewService.addReview(userId, productId, comment, rating)
        return res.status(200).json(response);
    } catch (e) {
        return res.status(404).json({
            message: 'Lỗi hệ thống, vui lòng thử lại sau!',
            error: e.message
        });
    }
}

const getReviewsProduct = async (req, res) => {
    const { productId } = req.params

    try {
        const response = await reviewService.getReviewsProduct(productId)
        return res.status(200).json(response);
    } catch (e) {
        return res.status(404).json({
            message: 'Lỗi hệ thống, vui lòng thử lại sau!',
            error: e.message
        });
    }
}

const deleteReview = async (req, res) => {
    const { reviewId } = req.params
    console.log(reviewId)
    try {
        if (!reviewId) {
            return res.status(200).json({
                status: "Err",
                message: 'The reviewId is required'
            })
        }
        const response = await reviewService.deleteReview(reviewId);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(404).json({
            message: 'Lỗi hệ thống, vui lòng thử lại sau!'
        });
    }
}

module.exports = { addReview, getReviewsProduct, deleteReview };