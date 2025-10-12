// src/lib/ApiCall.ts
import axiosClient from "@/API/axiosClient";
import { type AxiosRequestConfig, type Method } from "axios";

export const ApiCall = async (
  method: Method,
  url: string,
  body: Record<string, any> = {},
  customHeaders: Record<string, any> = {},
  params: Record<string, any> = {}
) => {
  const config: AxiosRequestConfig = {
    method,
    url,
    data: body,
    params,
    headers: { ...customHeaders },
  };

  const response = await axiosClient(config);
  return response.data;
};

