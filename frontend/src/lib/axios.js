import axios from "axios";

const isDevelopment = import.meta.env.MODE === 'development';
const BASE_URL = isDevelopment 
  ? '/api' 
  : `${import.meta.env.VITE_BACKEND_URL}/api`;

export const API_BASE_URL = BASE_URL;

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 403) {
      const message = error.response.data?.message || "";

      if (
        !message.includes("Email not verified") &&
        !message.includes("Please verify your email")
      ) {
        window.location.href = "/";
      }
    }

    return Promise.reject(error);
  }
);