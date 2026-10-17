import { apiFetch } from "@/lib/api";

export async function register(data: {
  nickname: string;
  email: string;
  password: string;
}) {
  return await apiFetch("/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
}
