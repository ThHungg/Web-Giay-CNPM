import axios from "axios"

export const getStat = async (month, year) => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/stat/getStat`, {
        params: { month, year }
    });
    return res.data;
};

export const forceUpdateStat = async (month, year) => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/stat/updateStat`, {
        params: { month, year }
    });
    return res.data;
};

