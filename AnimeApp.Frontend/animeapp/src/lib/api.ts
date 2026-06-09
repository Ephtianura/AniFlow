import { getKawaiiError, KawaiiErrorType } from "@/hooks/getKawaiiError";
import { parseApiErrors } from "@/hooks/parseApiErrors";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

type ApiFetchOptions = RequestInit & {
  cookieHeader?: string;
};

export async function apiFetch<T>(
  endpoint: string,
  options: ApiFetchOptions = {},
): Promise<T> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), 8000);

  const headers = new Headers(options.headers || {});

  // 🔐 SSR cookies 
  if (options.cookieHeader) {
    headers.set("Cookie", options.cookieHeader);
  }

  // 📦 JSON по умолчанию (кроме FormData)
  if (!(options.body instanceof FormData)) {
    if (!headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }
  }

  let res: any = null;
  try {
    res = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      cache: options?.cache,
      headers,
      credentials: "include",
    });
    clearTimeout(id);
  } catch {
    throw {
      status: 0,
      messages: [getKawaiiError(KawaiiErrorType.Network)],
    };
  }

  // Пробуем распарсить JSON
  let data: any = null;
  try {
    const text = await res.text();
    data = text ? JSON.parse(text) : null;
  } catch {
    data = null;
  }

  // Важная отладка (не трогать)
  if (process.env.NODE_ENV === "development") {
    console.log(
      "📤 API Response:",
      endpoint,
      "status:",
      res.status,
      "body:",
      data,
    );
  }

  // Парсинг ошибок
  if (!res.ok) {
    const messages = parseApiErrors(res, data);
    throw {
      status: res.status,
      messages,
    };
  }

  return data;
}
