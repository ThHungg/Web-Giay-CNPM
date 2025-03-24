import axios from "axios"

export const createOrder = async (userId, items, shippingAddress, paymentMethod, note, total, customerInfo) => {
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/order/create-order`, {
        userId,
        items,
        shippingAddress,
        paymentMethod,
        note,
        total,
        customerInfo,
    });
    return res.data;
};

export const getAllOrder = async (access_token) => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/order/getAllOrder`, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    });
    return res.data;
};
