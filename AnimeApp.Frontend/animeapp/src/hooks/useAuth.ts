"use client";

import { useState } from "react";
import { apiFetch } from "@/lib/api"; 
import { toast } from "react-toastify";

export function useAuth() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function register(data: { nickname: string; email: string; password: string }) {
        setLoading(true);
        setError(null);

        try {
            const res = await apiFetch("/auth/register", {
                method: "POST",
                body: JSON.stringify(data),
            });

            return res;
        } catch (err: any) {
        if (err.status >= 500) toast.error("Сервер приліг поспати...");
            setError(err.error || err.message || "Registration failed");
        } finally {
            setLoading(false);
        }
    }

    async function login(data: { email: string; password: string }) {
        setLoading(true);
        setError(null);

        try {
            const res = await apiFetch("/auth/login", {
                method: "POST",
                body: JSON.stringify(data),
            });

            return res;
        } catch (err: any) {
            setError(err.message || "Login failed");
        } finally {
            setLoading(false);
        }
    }

    return { loading, error, register, login };
}
