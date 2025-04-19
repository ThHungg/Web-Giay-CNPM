import axios from "axios"
import { axiosJWT } from "./userServices";

export const createBanner = async (data) => {
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/banner/createBanner`, data)
    return res.data;
}

export const getAllBanner = async () => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/banner/getAllBanner`)
    return res.data;
};

export const updateStatusBanner = async (id, status) => {
    const res = await axios.patch(`${process.env.REACT_APP_API_URL}/banner/updateStatusBanner/${id}`, { status })
    return res.data;
};

export const getActiveBanner = async () => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/banner/getActiveBanner`)
    return res.data;
};

export const deleteBanner = async (id) => {
    const res = await axios.delete(`${process.env.REACT_APP_API_URL}/banner/delete/${id}`)
    return res.data;
};

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

