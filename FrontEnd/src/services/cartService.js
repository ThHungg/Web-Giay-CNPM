import axios from "axios"

export const addToCart = async (userId, productId, size, quantity, price) => {
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/cart/add`, {
        userId,
        productId,
        size,
        quantity,
        price
    })
    console.log(res)
    return res.data
}

export const getCart = async (userId) => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/cart/getCart/${userId}`)
    return res.data
}