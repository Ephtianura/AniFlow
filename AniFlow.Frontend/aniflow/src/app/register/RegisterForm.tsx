"use client";

import { useState } from "react";
import Link from "next/link";
import WhiteCard from "@/components/WhiteCard";
import { register } from "@/hooks/register";
import { toast } from "react-toastify";
import { getKawaiiError, KawaiiErrorType } from "@/hooks/getKawaiiError";
import Checkbox from "@mui/material/Checkbox";
import { purple } from "@mui/material/colors";

export default function RegisterForm() {
    const [isAgreed, setIsAgreed] = useState(false);

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
        } catch (err: any) {
            const message = Array.isArray(err.messages)
                ? err.messages.find(Boolean)
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
                            type="password"
                            placeholder="Пароль"
                            className="input mt-1 w-full h-11 btn-primary text-gray-text-dark font-medium text-lg shadow-inner "
                            value={form.password}
                            onChange={e => setForm({ ...form, password: e.target.value })}
                        />
                    </div>

                    {/* Блок с чекбоксом и красивым текстом */}
                    <div className="flex items-start gap-2 mt-3 px-1">
                        <Checkbox
                            id="terms-checkbox"
                            checked={isAgreed}
                            onChange={(e) => setIsAgreed(e.target.checked)}
                            color="secondary"
                            className="mt-0.5 h-4 w-4"
                            sx={{
                                color: purple[800],
                                '&.Mui-checked': {
                                    color: purple[800],
                                },
                                padding: 0, // Убираем дефолтные паддинги MUI для точного выравнивания
                            }}
                        />
                        <label htmlFor="terms-checkbox" className="text-sm text-gray-text-dark select-none cursor-pointer leading-tight">
                            Я погоджуюсь з{" "}
                            <Link href="/terms" className="primary-link font-medium">
                                Умовами використання
                            </Link>
                            {" та "}
                            <Link href="/privacy" className="primary-link font-medium">
                                Політикою конфіденційності
                            </Link>
                        </label>
                    </div>

                    {/* Кнопка регистрации с блокировкой */}
                    <button
                        disabled={!isAgreed}
                        className="btn-purple mx-auto rounded-sm mt-4 text-white text-lg font-medium px-10 py-2 transition-all duration-200 
                           disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-purple-none cursor-pointer"
                    >
                        Зареєструватись
                    </button>

                    <Link href="/login" className="mt-3 text-sm text-center text-primary hover:underline transition">
                        Вже є акаунт?
                    </Link>
                </form>
            </WhiteCard>
        </div>
    );
}
