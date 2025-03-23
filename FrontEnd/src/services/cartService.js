import axios from "axios"

export const addToCart = async (userId, productId, size, quantity, price) => {
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/cart/add`, {
        userId,
        productId,
        size,
        quantity,
        price
    })
    return res.data
}

export const getCart = async (userId) => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/cart/getCart/${userId}`)
    return res.data
}

export const removeFromCart = async (userId, productId) => {
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/cart/remove`, {
        userId, productId: productId._id
    })
    return res.data
}


export const updateCart = async (userId, productId, quantity) => {
    const res = await axios.put(`${process.env.REACT_APP_API_URL}/cart/update`, {
        userId, productId: productId._id, quantity
    })
    return res.data
}

export const clearCart = async (userId) => {
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/cart/clear-cart`, {
        userId
    })
    return res.data
}