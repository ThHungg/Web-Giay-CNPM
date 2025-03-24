import axios from "axios"
import { axiosJWT } from "./userServices"

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

export const updateOrder = async (orderId, access_token, data) => {
    const res = await axiosJWT.put(`${process.env.REACT_APP_API_URL}/order/updateOrder/${orderId}`, data, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    })
    return res.data
}

export const getOrdersByUserId = async (userId) => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/order/historyOrder/${userId}`,
        userId
    );
    return res.data;
};

