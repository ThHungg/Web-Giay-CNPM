import axios from "axios"

export const createVNPayPayment = async (orderId, amount, bankCode = "NCB", language = "vn") => {
    console.log("amount", amount)
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/vnpay/create_payment`, {
        params: { orderId, amount, bankCode, language }
    });
    return res.data;
};

export const getVNPayPaymentResult = async (queryParams) => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/vnpay/payment-result`, {
        params: queryParams,
    });
    return res.data;
};
