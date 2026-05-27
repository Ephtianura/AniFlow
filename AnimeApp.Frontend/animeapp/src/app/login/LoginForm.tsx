"use client";

import { useState } from "react";
import Link from "next/link";
import WhiteCard from "@/components/WhiteCard";
import { login } from "@/hooks/login";
import { toast } from "react-toastify";
import { getKawaiiError, KawaiiErrorType } from "@/hooks/getKawaiiError";

export default function LoginForm() {
    const [error, setError] = useState(null);
    const [form, setForm] = useState({
        email: "",
        password: ""
    });
    const onSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();
        try {
            await login(form);
            window.location.href = "/";
        } catch (err: any) {
            // console.log(`LOG:::${err.messages}`)
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

                    <button className="btn-purple mx-auto rounded-sm mt-4 cursor-pointer text-white text-lg font-medium px-10 py-2">
                        Увійти
                    </button>

                    <Link href="/register" className="mt-3 text-sm text-center text-primary hover:underline transition">
                        Немає акаунту?
                    </Link>

                    {/* <Link href="/register" className="btn-primary text-gray-text-dark text-center ">
                        Зареєструватись
                    </Link> */}
                </form>
            </WhiteCard>

        </div >
    );
}

// Вывод масива каваи ошибок
// catch (err) {
//     if (Array.isArray(err)) {
//         err.forEach((msg) => {
//             if (typeof msg === 'string') toast.error(msg);
//         });
//     } else {
//         const kawaiError = getKawaiiError(KawaiiErrorType.Server)
//         toast.error(kawaiError);
//     }
// }