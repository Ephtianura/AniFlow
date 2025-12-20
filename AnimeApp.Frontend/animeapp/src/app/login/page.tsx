"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import WhiteCard from "@/components/WhiteCard";

export default function LoginPage() {
    const { login, loading, error } = useAuth();

    const [form, setForm] = useState({
        email: "",
        password: ""
    });

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        const res = await login(form);

        if (res) {
            window.location.href = "/animes"; 
        }
    }

    return (
        <div className="flex justify-center items-center">
            <WhiteCard>

                <form
                    onSubmit={onSubmit}
                    className="flex flex-col w-[520px]  gap-2"
                >
                    <h1 className="text-4xl font-medium mb-4 text-center text-primary-black">Вхід</h1>

                    <div>
                        <h3 className="text-gray-text-dark text-lg">Логін</h3>
                        <input
                            type="email"
                            placeholder="Email"
                            className="input mt-1 btn-primary h-11 text-gray-text-dark font-medium text-lg shadow-inner"
                            value={form.email}
                            onChange={e => setForm({ ...form, email: e.target.value })}
                        />
                    </div>


                    <div>
                        <h3 className="text-gray-text-dark text-lg">Пароль</h3>
                            <input
                                type="password"
                                placeholder="Пароль"
                                className="input mt-1 w-full h-11 btn-primary text-gray-text-dark font-medium text-lg shadow-inner"
                                value={form.password}
                                onChange={e => setForm({ ...form, password: e.target.value })}
                            />
                    </div>


                    {error && <p className="text-red-500 mt-2">{error}</p>}

                    <button className="mx-auto rounded-sm mt-4 cursor-pointer text-white text-lg font-medium bg-primary px-10 py-2
                    border-3 active:border-purple-400/90 active:bg-purple-700 hover:bg-purple-600  active:shadow-inner shadow-black/30 
                    transition-colors" disabled={loading}>
                        {loading ? "Входимо..." : "Увійти"}
                    </button>

                    <p className="mt-3 text-sm text-center text-primary">
                        Немає акаунту?
                    </p>
                    <Link href="/register" className="text-blue-600 btn-primary text-gray-text-dark text-center ">
                        Зареєструватись
                    </Link>
                </form>
            </WhiteCard>

        </div>
    );
}
