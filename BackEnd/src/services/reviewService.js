const Review = require('../models/Review')
const Product = require('../models/Product')

const addReview = async (userId, productId, comment, rating) => {
    return new Promise(async (resolve, reject) => {
        try {
            const review = new Review({ userId: userId, productId: productId, comment, rating });
            await review.save();

            const reviews = await Review.find({ productId: productId });

            const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
            const avgRating = totalRating / reviews.length;
            await Product.findByIdAndUpdate(productId, { averageRating: avgRating.toFixed(1) });

            resolve({
                status: "OK",
                message: "Thêm đánh giá thành công",
                review
            })
        } catch (e) {
            reject(e)
        }
    })
}
const getReviewsProduct = async (productId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const reviews = await Review.find({ productId }).populate("userId", "name");

            resolve({
                status: "OK",
                message: "Lấy đánh giá thành công",
                reviews
            })
        } catch (e) {
            reject(e)
        }
    })
}

const deleteReview = (reviewId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkReview = await Review.findById(reviewId);
            if (checkReview === null) {
                resolve({
                    status: "Ok",
                    message: 'Review không xác định'
                })
            }

            await Review.findByIdAndDelete(reviewId)
            resolve({
                status: "Ok",
                message: "Xóa thành công",
            })
        } catch (e) {
            reject(e);
        }
    });
};


module.exports = { addReview, getReviewsProduct, deleteReview };