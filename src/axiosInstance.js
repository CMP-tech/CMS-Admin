import axios from "axios";

const axiosInstance = axios.create({
  // baseURL: "http://localhost:4000/api", // ✅ change for production
  baseURL: "https://cms-api-sjto.onrender.com/api", // ✅ change for production
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Request Interceptor → attach token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage?.getItem("token"); // or sessionStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Response Interceptor → handle errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.error("Unauthorized! Redirecting to login...");
      // e.g., window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
