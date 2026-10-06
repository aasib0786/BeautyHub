import axios from "axios";

export const axiosInstance = axios.create({
    // baseURL:"http://localhost:5000",
    baseURL: "https://beautyhub-37gk.onrender.com",
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
})