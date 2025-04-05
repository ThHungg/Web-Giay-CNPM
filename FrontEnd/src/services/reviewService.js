import axios from "axios"

export const addReview = async (userId, productId, comment, rating) => {
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/review/addReview`, userId, { productId, comment, rating })
    return res.data
}

export const getReviewProduct = async (id) => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/review/getReview/${id}`)
    return res.data
}