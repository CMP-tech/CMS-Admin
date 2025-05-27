import axios from "axios";

const API_BASE_URL = "http://localhost:5000/";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("adminToken"); // ensure key is consistent
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log("Request sent to:", config.baseURL + config.url);
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    if (response?.data?.message) {
      console.log("Response received (backend message):", response.data.message);
    }
    return response; // return full response for flexibility
  },
  (error) => {
    const errMsg = error?.response?.data?.message || error.message || "Unknown error";
    console.error("Axios Response Error:", errMsg);
    return Promise.reject(error);
  }
);

export default axiosInstance;
