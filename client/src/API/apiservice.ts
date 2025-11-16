// src/lib/ApiCall.ts
import axiosClient from "@/API/axiosClient";
import type { ChatResponse, Conversation, Message } from "@/types";
import { authService } from "@/utils/AuthService";
import { type AxiosRequestConfig, type Method } from "axios";

export const ApiCall = async (
  method: Method,
  url: string,
  body: any = {},
  params: Record<string, any> = {},
  customHeaders: Record<string, any> = {}
) => {
  const token = await authService.getAccessToken();

  const isFormData = body instanceof FormData;

  const config: AxiosRequestConfig = {
    method,
    url,
    data: body,
    params,
    headers: {
      Authorization: `Bearer ${token}`,
      ...customHeaders,
      ...(isFormData
        ? { "Content-Type": "" }
        : { "Content-Type": "application/json" }),
      // 👆 IMPORTANT: Do NOT set Content-Type for FormData
    },
  };

  // Let Axios handle FormData — it will add correct boundary headers
  const response = await axiosClient(config);
  return response.data;
};

export const send_message = async (
  message: string,
  conversation_id: string = "",
  files?: File[]
): Promise<ChatResponse> => {
  const formData = new FormData();
  formData.append("message", message);
  formData.append("conversation_id", conversation_id);
  if (files) {
    files.forEach((file) => {
      formData.append("files", file); // multiple
    });
  }

  const response = await ApiCall(
    "POST",
    `${import.meta.env.VITE_SERVER_URL}/chat/messages/`,
    formData // ApiCall now supports this
  );

  return response?.data;
};

export const get_all_messages = async (
  conversation_id: string,
  cursor: string = "",
  limit: number = 30
): Promise<{ messages: Message[]; meta: Record<string, unknown> }> => {
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

export const get_all_conversations = async (): Promise<Conversation[]> => {
  const response = await ApiCall(
    "GET",
    `${import.meta.env.VITE_SERVER_URL}/chat/conversations/`
  );
  return response?.data?.conversations;
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
