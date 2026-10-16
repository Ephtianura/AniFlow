import { apiFetch } from "@/lib/api";

export async function login(data: { email: string; password: string }) {
  return await apiFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
}
