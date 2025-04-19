import axios from "axios"
import { axiosJWT } from "./userServices";

export const createBrand = async (data) => {
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/brand/createBrand`, data)
    return res.data;
}

export const getAllBrand = async () => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/brand/getAllBrand`)
    return res.data;
};

export const updateStatusBrand = async (id, status) => {
    const res = await axios.patch(`${process.env.REACT_APP_API_URL}/brand/updateStatusBrand/${id}`, { status })
    return res.data;
};

export const getActiveBrand = async () => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/brand/getActiveBrand`)
    return res.data;
};

export const deleteBrand = async (id) => {
    const res = await axios.delete(`${process.env.REACT_APP_API_URL}/brand/delete/${id}`)
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

