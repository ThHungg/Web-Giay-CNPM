import axios from "axios"
import { axiosJWT } from "./userServices"

export const getAllProduct = async () => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/product/get-all`)
    return res.data
}

export const createProduct = async (data) => {
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/product/create`, data)
    return res.data
}

export const getDetailsProduct = async (id) => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/product/details/${id}`)
    return res.data
}

export const updateProduct = async (id, access_token, data) => {
    const res = await axiosJWT.put(`${process.env.REACT_APP_API_URL}/product/update/${id}`, data, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    })
    return res.data
}

export const reduceStock = async (id, quantity) => {
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/product/reduceStock`, {
        id, quantity
    })
    return res.data
}

export const softDelete = async (id) => {
    const res = await axiosJWT.delete(`${process.env.REACT_APP_API_URL}/product/softDelete/${id}`);
    return res.data
}

export const restore = async (id) => {
    const res = await axiosJWT.patch(`${process.env.REACT_APP_API_URL}/product/restore/${id}`);
    return res.data
}

export const getActiveProducts = async () => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/product/getActive`)
    return res.data
}
