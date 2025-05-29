import axios from "axios";

const API_BASE_URL = "https://examli-be.onrender.com"; // Removed trailing slash for safety

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("Authorization header set");
    } else {
      console.log("No auth token found");
    }
    console.log("Request sent to:", config.baseURL + config.url);
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    if (response?.data?.message) {
      console.log("Response received (backend message):", response.data.message);
    }
    return response;
  },
  (error) => {
    const errMsg = error?.response?.data?.message || error.message || "Unknown error";
    console.error("Axios Response Error:", error.response?.status, errMsg);
    return Promise.reject(error);
  }
);

export default axiosInstance;
