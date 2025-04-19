import axios from "axios"
import { axiosJWT } from "./userServices";

export const createSupport = async (data) => {
    console.log("data", data)
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/support/createSupport`, data)
    return res.data;
}

export const getAllSupport = async () => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/support/getSupport`)
    return res.data;
};

export const getHistorySupport = async (userId) => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/support/historySupport/${userId}`)
    return res.data;
};

export const updateRequestSupport = async (id, status) => {
    const res = await axios.patch(`${process.env.REACT_APP_API_URL}/support/updateRequestSupport/${id}`, { status })
    return res.data;
};

export const deleteSupport = async (id) => {
    const res = await axios.delete(`${process.env.REACT_APP_API_URL}/support/deleteSupport/${id}`)
    return res.data;
};


// export const getActiveBrand = async () => {
//     const res = await axios.get(`${process.env.REACT_APP_API_URL}/brand/getActiveBrand`)
//     return res.data;
// };

// export const getDetailVoucher = async (voucherId) => {
//     const res = await axios.get(`${process.env.REACT_APP_API_URL}/voucher/detailVoucher/${voucherId}`)
//     return res.data
// }

// export const updateVoucher = async (voucherId, access_token, data) => {
//     const res = await axiosJWT.put(`${process.env.REACT_APP_API_URL}/voucher/updateVoucher/${voucherId}`, data, {
//         headers: {
//             token: `Bearer ${access_token}`,
//         }
//     })
//     return res.data
// }

