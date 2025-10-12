import axios, { type InternalAxiosRequestConfig } from "axios";
import { authService } from "@/utils/AuthService";
import { ApiError } from "@/API/ApiError";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// Request interceptor to attach token
axiosClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await authService.getAccessToken();
    if (token && config.headers) {
      config.headers["Authorization"] = `Bearer ${token}`;
      config.headers["Content-Type"] = "application/json";
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for structured error handling
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const res = error.response;
    let message = "Something went wrong";

    if (res) {
      if (res.status === 401) message = "Unauthenticated";
      else if (res.data?.message) message = res.data.message;
      throw new ApiError(message, res.status, res.data?.code);
    } else {
      throw new ApiError(error.message);
    }
  }
);

export default axiosClient;
