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
  console.log("Using token:", token);
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

export const send_message = async (
  message: string,
  conversation_id: string = ""
): Promise<ChatResponse> => {
  const response = await ApiCall(
    "POST",
    `${import.meta.env.VITE_SERVER_URL}/chat/messages/`,
    {
      message,
      conversation_id,
    }
  );
  return response?.data;
};

export const get_all_messages = async (
  conversation_id: string,
  cursor: string = "",
  limit: number = 10
) => {
  const response = await ApiCall(
    "GET",
    `${import.meta.env.VITE_SERVER_URL}/chat/messages/`,
    {},
    { cursor, limit, conversation_id }
  );
  return response?.data;
};

export const delete_message = async (messageId: string) => {
  const response = await ApiCall(
    "DELETE",
    `${import.meta.env.VITE_SERVER_URL}/chat/${messageId}/`
  );
  return response?.data;
};

export const get_all_conversations = async () => {
  const response = await ApiCall(
    "GET",
    `${import.meta.env.VITE_SERVER_URL}/chat/conversations/`
  );
  return response?.data;
};

export const create_conversation = async (
  title: string | null = null,
  is_initial: boolean = false,
  customHeaders = {}
) => {
  const response = await ApiCall(
    "POST",
    `${import.meta.env.VITE_SERVER_URL}/chat/conversations/`,
    { title, is_initial },
    {},
    customHeaders
  );
  return response?.data;
};
