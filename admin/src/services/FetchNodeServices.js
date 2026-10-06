import axios from "axios";
const serverURL = "https://beautyhub-37gk.onrender.com";
// const serverURL = "http://localhost:5000";

const getAuthHeaders = () => {
  const token = localStorage.getItem("adminToken") || sessionStorage.getItem("adminToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const postData = async (url, body) => {
  try {
    var response = await axios.post(`${serverURL}/${url}`, body, {
      withCredentials: true,
      headers: {
        ...getAuthHeaders(),
      },
    });

    var data = response.data;
    return data;
  } catch (e) {
    return null;
  }
};

const getData = async (url) => {
  try {
    var response = await axios.get(`${serverURL}/${url}`, {
      withCredentials: true,
      headers: {
        ...getAuthHeaders(),
      },
    });         
         
    var data = response.data;
    return data;
  } catch (e) {
    return null;
  }
};

const axiosInstance = axios.create({
  baseURL: serverURL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("adminToken") || sessionStorage.getItem("adminToken");
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
export { serverURL, postData, getData };

