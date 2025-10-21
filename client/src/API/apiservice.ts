// src/lib/ApiCall.ts
import axiosClient from "@/API/axiosClient";
import { authService } from "@/utils/AuthService";
import { type AxiosRequestConfig, type Method } from "axios";

export const ApiCall = async (
  method: Method,
  url: string,
  body: Record<string, any> = {},
  customHeaders: Record<string, any> = {},
  params: Record<string, any> = {}
) => {
  const token = await authService.getAccessToken();
  console.log(token);
  const config: AxiosRequestConfig = {
    method,
    url,
    data: body,
    params,
    headers: {
      ...customHeaders,
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axiosClient(config);
  return response.data;
};

export const send_message = async (message: string) => {
  console.log("API Service - send_message called with message:", message);
  return ApiCall("POST", `${import.meta.env.VITE_SERVER_URL}/chat/`, {
    message,
  });
};
