import axios from 'axios';

const API_BASE_URL = "http://localhost:5000/api";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    // Add authentication token if available
    // const token = localStorage.getItem('authToken');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    console.log("Request sent:", config.url);
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    if (response.data?.success) {
      console.log("Response received (success):", response.config.url);
      return response.data.data;
    } else if (response.data?.message) {
      console.error("Response received (backend error):", response.data.message);
      return Promise.reject(new Error(response.data.message));
    } else {
      console.log("Response received (raw success):", response.config.url);
      return response.data;
    }
  },
  (error) => {
    console.error("Response error:", error.response || error.message);

    let errorMessage = "An unexpected error occurred.";

    if (error.response) {
      errorMessage = error.response.data?.message ||
                     `Server error: ${error.response.status} - ${error.response.statusText || 'Unknown Error'}`;
    } else if (error.request) {
      errorMessage = "No response from server. Please check your network connection.";
    } else {
      errorMessage = error.message;
    }

    return Promise.reject(new Error(errorMessage));
  }
);

export default axiosInstance;
