const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  // Создаём копию опций, чтобы безопасно менять headers/body
  const extra: RequestInit = { ...options };

  // Работаем с Headers через объект Headers — корректно обрабатывает и plain object, и Headers
  const headers = new Headers(options.headers || {});

  // Если body — FormData, удаляем Content-Type (браузер сам его укажет)
  if (extra.body instanceof FormData) {
    headers.delete("Content-Type");
  } else {
    // Для прочих случаев — если нет Content-Type, ставим application/json
    if (!headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }
  }
  extra.headers = headers;
  extra.credentials = "include";

  let res: Response;
  try {
    res = await fetch(`${API_URL}${endpoint}`, extra);
  } catch (networkErr) {
    // Сетевые ошибки (CORS, offline, отказ соединения и т.п.)
    console.error("Network/fetch error:", networkErr);
    const err: any = new Error("Network error");
    err.original = networkErr;
    throw err;
  }

  const text = await res.text(); // safe: if no body, text === ""
  let data: any = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch (e) {
    // Не JSON в ответе — это нормально, логируем, но не ломаемся
    // console.debug("response is not JSON:", e, text);
    data = null;
  }

  // Лог (удали/закомментируй если мешает)
  console.log("📤 API Response:", endpoint, "status:", res.status, "body:", data ?? text);

  if (!res.ok) {
    const err: any = new Error(data?.message || `HTTP error! status: ${res.status}`);
    err.status = res.status;
    err.data = data ?? text;
    if (data && typeof data === "object" && data.errors) err.validationErrors = data.errors;
    throw err;
  }

  return data;
}


    export const getUserMe = async () => {
    return apiFetch("/user/me");
    };
