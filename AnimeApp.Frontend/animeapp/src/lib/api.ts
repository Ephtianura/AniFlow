import { ApiErrorResponse } from "@/core/types";
import { ApiError } from "./ApiError";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

type ApiFetchOptions = RequestInit & {
  cookieHeader?: string;
};

export async function apiFetch<T>(
  endpoint: string,
  options: ApiFetchOptions = {}
): Promise<T> {
  const headers = new Headers(options.headers || {});

  // 🔐 SSR cookies (если передали)
  if (options.cookieHeader) {
    headers.set("Cookie", options.cookieHeader);
  }

  // 📦 JSON по умолчанию (кроме FormData)
  if (!(options.body instanceof FormData)) {
    if (!headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }
  }

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
    credentials: "include",
  });

  // Пробуем распарсить JSON, но не падаем, если там пусто или текст
  let data: any = null;
  const contentType = res.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    const text = await res.text();
    data = text ? JSON.parse(text) : null;
  }

  // Важная отладка (не трогать)
  if (process.env.NODE_ENV === 'development') {
    console.log("📤 API Response:", endpoint, "status:", res.status, "body:", data);
  }

  // Если статус не 2xx
  if (!res.ok) {
  let errorData: ApiErrorResponse;
  
  try {
    errorData = await res.json();
  } catch {
    errorData = { title: `Interval server error: ${res.statusText}` };
  }

  const error = new ApiError(errorData, res.status);

  throw error;
}

  return data;
}
