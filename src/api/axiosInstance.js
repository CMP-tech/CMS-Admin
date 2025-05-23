// src/api/axiosInstance.js
import axios from 'axios';

const API_BASE_URL = "http://localhost:5000/";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor (keep as is)
axiosInstance.interceptors.request.use(
  (config) => {
    console.log("Request sent to:", config.baseURL + config.url);
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

// Response Interceptor (MODIFY THIS PART)
axiosInstance.interceptors.response.use(
  (response) => {
    if (response.data && response.data.success) {
      console.log("Response received (success) from:", response.config.baseURL + response.config.url);
      // Return only the 'data' part if your backend consistently wraps successful responses
      // Otherwise, just return response.data;
      return response.data.data;
    } else if (response.data && response.data.message) {
      // If your backend sends a non-error status (e.g., 200 OK) but includes a 'message'
      // to indicate a logical error, you might want to reject here.
      // However, for HTTP errors (like 400, 500), the 'error' callback below will trigger.
      console.error("Response received (backend message):", response.data.message);
      return Promise.reject(new Error(response.data.message)); // You might still want to reject here if this is a "soft" error
    } else {
      console.log("Response received (raw success) from:", response.config.baseURL + response.config.url);
      return response.data;
    }
  },
  (error) => {
    console.error("Axios Response Error (Interceptor):", error.response || error.message);

    // --- THE KEY CHANGE HERE ---
    // Re-throw the original error object from Axios.
    // This preserves error.response, error.response.data, etc.
    return Promise.reject(error);
  }
);

export default axiosInstance;