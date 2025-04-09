import axios from "axios"

export const createVoucher = async (data) => {
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/voucher/createVoucher`, data)
    return res.data;
}

export const getAllVoucher = async (access_token) => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/voucher/getAllVoucher`, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    })
    return res.data;
};

export const updateVoucherStatus = async (voucherId, status, access_token) => {
    const res = await axios.patch(`${process.env.REACT_APP_API_URL}/voucher/updateStatusVoucher/${voucherId}`, { status }, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    })
    return res.data;
};

export const getActiveVoucher = async () => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/voucher/getVoucher`)
    return res.data;
};

