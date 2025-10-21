// src/lib/ApiCall.ts
import axiosClient from "@/API/axiosClient";
import type { ChatResponse } from "@/types";
import { authService } from "@/utils/AuthService";
import { type AxiosRequestConfig, type Method } from "axios";

export const ApiCall = async (
  method: Method,
  url: string,
  body: Record<string, any> = {},
  params: Record<string, any> = {},
  customHeaders: Record<string, any> = {}
) => {
  const token = await authService.getAccessToken();
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

export const send_message = async (message: string): Promise<ChatResponse> => {
  const response = await ApiCall(
    "POST",
    `${import.meta.env.VITE_SERVER_URL}/chat/`,
    {
      message,
    }
  );
  return response?.data;
};
export const get_all_messages = async (
  cursor: string = "",
  limit: number = 10
) => {
  const response = await ApiCall(
    "GET",
    `${import.meta.env.VITE_SERVER_URL}/chat/`,
    {},
    { cursor, limit }
  );
  return response?.data;
};
