"use client";

import { useState, useEffect } from "react";
import { apiFetch } from "@/lib/api";
import { UserProfile } from "@/core/types";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

type Props = {
    profile: UserProfile
}

export default function EditForm({ profile }: Props) {
    const router = useRouter();

    const [nickname, setNickname] = useState(profile.nickname);
    const [email, setEmail] = useState(profile.email);
    const [password, setPassword] = useState("");
    const [write, setWriting] = useState(false);

    useEffect(() => {
        const changed =
            nickname.trim() !== profile.nickname ||
            email.trim() !== profile.email ||
            password.trim() !== "";

        setWriting(changed);
    }, [nickname, email, password, profile]);

    const handleSave = async () => {
        try {
            await apiFetch("/user/me", {
                method: "PATCH",
                body: JSON.stringify({ nickname, email, password }),
            });
            toast.success("Профіль оновлено успішно!");
            setPassword("");
            router.push("/profile/edit");
        } catch (err: any) {
            console.error(err);
            toast.error(`Помилка оновлення профілю ${err.message}`);
        } finally {
            setWriting(false);
        }
    };

    return (
        <div className="flex flex-col gap-6 items-center w-full lg:items-start">

            <div className="flex flex-col gap-4 w-full lg:max-w-100">
                <label className="flex flex-col gap-1">
                    <span>Нікнейм</span>
                    <input
                        type="text"
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                        className="btn-primary p-2"
                    />
                </label>
                <label className="flex flex-col gap-1">
                    <span>Email</span>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="btn-primary p-2"
                    />
                </label>
                <label className="flex flex-col gap-1">
                    <span>Пароль</span>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="new-password"
                        className="btn-primary p-2"
                    />
                </label>
            </div>

            <button
                onClick={handleSave}
                disabled={!write}
                className="btn-primary py-2 px-4 cursor-pointer disabled:cursor-auto"
            >
                Зберегти
            </button>
        </div>
    )
}
