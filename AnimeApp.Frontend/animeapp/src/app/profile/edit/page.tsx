"use client";

import { useUserProfile } from "@/hooks/useUserProfile";
import { FaCamera } from "react-icons/fa";
import { useState, useEffect, useRef } from "react";
import { apiFetch } from "@/lib/api";
import { ProfileLayout } from "../ProfileLayout";
import ProfileImages from "../ProfileImages";

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
            <div className="flex flex-col gap-6">
                <ProfileImages
                    avatarUrl={profile.avatarUrl}
                    nickname={profile.nickname}
                    formattedRegistrationDate={formattedRegistrationDate}
                />
                <div>
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="btn-primary w-50 flex items-center gap-2 cursor-pointer text-sm"
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
                <div className="flex flex-col sm:flex-row gap-6">
                    

                    <div className="flex flex-col w-full gap-4">

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
