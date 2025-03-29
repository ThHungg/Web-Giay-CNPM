import axios from "axios"

export const axiosJWT = axios.create()

export const loginUser = async (data) => {
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/user/sign-in`, data)
    return res.data;
}

export const registerUser = async (data) => {
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/user/sign-up`, data)
    return res.data;
}

export const getDetailsUser = async (id, access_token) => {
    const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/user/get-details/${id}`, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    })
    return res.data;
}

export const getAllUser = async (access_token) => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/user/getAll`, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    })
    return res.data;
};


export const refreshToken = async () => {
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/user/refresh-token`, {
        withCredentials: true,
    });
    console.log("Kết quả refresh token:", res.data);
    return res.data;
};


export const logoutUser = async () => {
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/user/log-out`);
    return res.data;
};

export const updateUser = async (id, data) => {
    const res = await axiosJWT.put(
        `${process.env.REACT_APP_API_URL}/user/update-user/${id}`,
        data
    );
    return res.data;
};

export const sendOtp = async (email) => {
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/user/reset-password`, { email });
    return res.data;
};

export const resetPass = async (email, otp, newPassword) => {
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/user/verify-otp-reset-password`, { email, otp, newPassword });
    return res.data;
};







