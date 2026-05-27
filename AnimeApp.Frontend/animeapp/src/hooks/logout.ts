import { apiFetch } from "@/lib/api";
import { toast } from "react-toastify";

export async function logout() {
  try {
    await apiFetch("/auth/logout", { method: "POST" });
    window.location.href = "/";
  } catch {
    toast.error("Помилка при виході з системи");
  }
}
