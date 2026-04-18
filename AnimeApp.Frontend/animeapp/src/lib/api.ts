import { ApiErrorResponse } from "@/core/types";
import { ApiError } from "./ApiError";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const extra: RequestInit = { ...options };
  const headers = new Headers(options.headers || {});

  if (!(extra.body instanceof FormData)) {
    if (!headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }
  }
  
  extra.headers = headers;
  extra.credentials = "include";

  const res = await fetch(`${API_URL}${endpoint}`, extra);

  // 1. Пробуем распарсить JSON, но не падаем, если там пусто или текст
  let data: any = null;
  const contentType = res.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    const text = await res.text();
    data = text ? JSON.parse(text) : null;
  }

  // Лог для дебага (в проде можно скрыть)
  // Важная отладка
  console.log("📤 API Response:", endpoint, "status:", res.status, "body:", data);

  // 2. Обработка 401 (Unauthorized)


  // 3. Если статус не 2xx
  if (!res.ok) {
  let errorData: ApiErrorResponse;
  
  try {
    errorData = await res.json();
  } catch {
    errorData = { title: `Server error: ${res.statusText}` };
  }

  const error = new ApiError(errorData, res.status);

  throw error;
}

  return data;
}


    export const getUserMe = async () => {
    return apiFetch("/user/me");
    };
