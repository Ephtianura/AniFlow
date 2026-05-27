"use client";

import { useState } from "react";
import Link from "next/link";
import WhiteCard from "@/components/WhiteCard";
import { register } from "@/hooks/register";
import { toast } from "react-toastify";
import { getKawaiiError, KawaiiErrorType } from "@/hooks/getKawaiiError";

export default function RegisterForm() {

    const [form, setForm] = useState({
        nickname: "",
        email: "",
        password: ""
    });

    const onSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();
        try {
            await register(form);
            window.location.href = "/";
        } catch (err) {
            const message = Array.isArray(err)
                ? err.find(Boolean)
                : null;
            toast.error(message ?? getKawaiiError(KawaiiErrorType.Server));
        }
    };
    return (
        <div className="flex justify-center items-center">
            <WhiteCard className="w-full max-w-125">
                <form
                    onSubmit={onSubmit}
                    className="flex flex-col gap-2"
                >
                    <h1 className="text-4xl font-medium mb-4 text-center text-primary-black">Реєстрація</h1>

                    <div>
                        <h3 className="text-gray-text-dark text-lg">Ім'я</h3>
                        <input
                            type="text"
                            placeholder="Ім'я"
                            className="input mt-1 btn-primary h-11 text-gray-text-dark font-medium text-lg shadow-inner"
                            value={form.nickname}
                            onChange={e => setForm({ ...form, nickname: e.target.value })}
                        />
                    </div>

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
                            type="new-password"
                            placeholder="Пароль"
                            className="input mt-1 w-full h-11 btn-primary text-gray-text-dark font-medium text-lg shadow-inner "
                            value={form.password}
                            onChange={e => setForm({ ...form, password: e.target.value })}
                        />
                    </div>

                    <button className="btn-purple mx-auto rounded-sm mt-4 cursor-pointer text-white text-lg font-medium px-10 py-2">
                        Зареєструватись
                    </button>

                    <Link href="/login" className="mt-3 text-sm text-center text-primary hover:underline transition">
                        Вже є акаунт?
                    </Link>

                    {/* <Link href="/login" className="btn-primary text-gray-text-dark text-center ">
                        Увійти
                    </Link> */}

                </form>
            </WhiteCard>
        </div>
    );
}
