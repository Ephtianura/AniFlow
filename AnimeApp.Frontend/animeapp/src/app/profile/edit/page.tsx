"use client";

import { ProfileLayout } from "@/components/ProfileLayout";
import { useUserProfile } from "@/hooks/useUserProfile";
import { FaCamera } from "react-icons/fa";
import { useState, useEffect, useRef } from "react";
import { apiFetch } from "@/lib/api";

export default function ProfileEdit() {
    const { profile, loading, error, reload, formattedRegistrationDate } = useUserProfile();

    const [nickname, setNickname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        if (profile) {
            setNickname(profile.nickname);
            setEmail(profile.email);
        }
    }, [profile]);

    if (loading) return <ProfileLayout>Завантаження...</ProfileLayout>;
    if (error) return <ProfileLayout>Помилка завантаження...</ProfileLayout>;
    if (!profile) return <ProfileLayout>Не знайдено профіль</ProfileLayout>;

    const handleSave = async () => {
        setSaving(true);
        setMessage(null);
        try {
            await apiFetch("/user/me", {
                method: "PATCH",
                body: JSON.stringify({ nickname, email, password }),
            });
            setMessage("Профіль оновлено успішно!");
            setPassword("");
            reload();
        } catch (err: any) {
            console.error(err);
            setMessage(err.message || "Помилка оновлення профілю");
        } finally {
            setSaving(false);
        }
    };

    const handleAvatarChange = async (file: File) => {
        const formData = new FormData();
        formData.append("Avatar", file);

        setSaving(true);
        setMessage(null);

        try {
            await apiFetch("/user/me/files", {
                method: "PATCH",
                body: formData,
            });
            setMessage("Аватар оновлено успішно!");
            reload();
        } catch (err: any) {
            console.error(err);
            setMessage(err.message || "Помилка оновлення аватара");
        } finally {
            setSaving(false);
        }
    };

    return (
        <ProfileLayout>
            <div className="bg-white h-30"></div>

            <div className="flex flex-col gap-6">
                <div className="flex gap-6">
                    <div className="flex flex-col gap-2">
                        <div className="h-50 w-50">
                            <img
                                src={profile.avatarUrl ?? "/404.gif"}
                                alt=""
                                className="rounded-full shadow-[0_0_20px_rgba(0,0,0,0.2)] w-full h-full object-cover"
                            />
                        </div>
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="btn-primary flex items-center gap-2 cursor-pointer text-sm"
                        >
                            <FaCamera className="w-4 h-4" /> Оновити Аватарку
                        </button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                                if (e.target.files?.[0]) handleAvatarChange(e.target.files[0]);
                            }}
                        />
                    </div>

                    <div className="flex flex-col w-full gap-4">
                        <p className="text-4xl font-normal">{profile.nickname}</p>
                        <p className="text-sm font-normal text-gray-text">
                            на сайті з {formattedRegistrationDate}
                        </p>
                        <hr className="text-hr-clr" />
                        <div className="flex flex-col gap-4 max-w-md">
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
                                <span>Пароль (залишити порожнім, якщо не змінювати)</span>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="btn-primary p-2"
                                />
                            </label>

                            {message && <p className="text-sm text-green-600">{message}</p>}
                        </div>
                    </div>
                </div>

                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="btn-primary py-2 px-4 cursor-pointer"
                >
                    {saving ? "Збереження..." : "Зберегти"}
                </button>
            </div>
        </ProfileLayout>
    );
}
