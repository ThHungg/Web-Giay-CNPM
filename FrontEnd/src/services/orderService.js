import axios from "axios"

export const createOrder = async (userId, items, shippingAddress, paymentMethod, note, total, customerInfo) => {
    // console.log("userId:", userId);
    // console.log("items:", items);
    // console.log("shippingAddress:", shippingAddress);
    // console.log("paymentMethod:", paymentMethod);
    // console.log("note:", note);
    // console.log("total:", total);
    // console.log("customerInfo", customerInfo);
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