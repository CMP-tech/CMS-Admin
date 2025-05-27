import axios from "axios";

const API_BASE_URL = "http://localhost:5000/";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token from localStorage (if exists)
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
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

axiosInstance.interceptors.response.use(
  (response) => {
    if (response.data && response.data.message) {
      console.log("Response received (backend message):", response.data.message);
    }
    return response.data;
  },
  (error) => {
    console.error("Axios Response Error (Interceptor):", error.response || error.message);
    return Promise.reject(error);
  }
);

export default axiosInstance;
