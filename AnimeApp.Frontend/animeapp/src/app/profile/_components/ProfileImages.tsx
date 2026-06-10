"use client";

import { apiFetch } from "@/lib/api";
import clsx from "clsx";
import { useRef, useState } from "react";
import { FaCamera } from "react-icons/fa";
import { toast } from "react-toastify";

type Props = {
    avatarUrl?: string | null;
    bannerUrl?: string | null;
    nickname: string;
    formattedRegistrationDate?: string;
    onEdit?: boolean;
}

interface UserUpdateFilesResponse {
    avatarUrl?: string | null,
    bannerUrl?: string | null,
}

export default function ProfileImages({ avatarUrl: avaratInit, bannerUrl: bannerInit, nickname, formattedRegistrationDate, onEdit = false }: Props) {
    const avatarFileInputRef = useRef<HTMLInputElement | null>(null);
    const bannerFileInputRef = useRef<HTMLInputElement | null>(null);
    const [avatarUrl, setAvatarUrl] = useState(avaratInit)
    const [bannerUrl, setBannerUrl] = useState(bannerInit)

    const handleAvatarChange = async (file: File) => {
        const formData = new FormData();
        formData.append("Avatar", file);
        try {
            const res = await apiFetch<UserUpdateFilesResponse>("/user/me/files", {
                method: "PATCH",
                body: formData,
            });
            setAvatarUrl(res.avatarUrl);
            toast.success("Аватар оновлено успішно!");
        } catch (err: any) {
            console.error(err);
            toast.error(`Помилка оновлення аватара ${err.message}`)
        };
    }

    const handleBannerChange = async (file: File) => {
        const formData = new FormData();
        formData.append("Banner", file);
        try {
            const res = await apiFetch<UserUpdateFilesResponse>("/user/me/files", {
                method: "PATCH",
                body: formData,
            });
            setBannerUrl(res.bannerUrl);
            toast.success("Банер оновлено успішно!");
        } catch (err: any) {
            console.error(err);
            toast.error(`Помилка оновлення банеру ${err.message}`)
        };
    }

    return (
        <>
            {/* Баннер */}
            <div className="relative bg-white h-100 -m-4 select-none">
                    <img src={bannerUrl ?? "/NotFoundBannerPurple.webp"} alt="" className="object-cover h-full w-full select-none pointer-events-none" />

                {onEdit && (<>
                    <button
                        type="button"
                        onClick={() => bannerFileInputRef.current?.click()}
                        className={clsx(
                            "cursor-pointer flex items-center gap-2 absolute right-4 bottom-4 px-3 py-1.5",
                            "text-primary-black bg-gray-100 ring-1 ring-gray-300 rounded-lg",
                            "hover:bg-gray-200 hover:ring-[#CDCFD1] transition duration-200 active:scale-95"
                        )}
                    >
                        <div className="w-5 aspect-square p-0 flex items-center justify-center">
                            <FaCamera className="w-full h-full " />
                        </div>
                        <span>Обкладинка</span>
                    </button>

                    <input
                        ref={bannerFileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                            if (e.target.files?.[0]) handleBannerChange(e.target.files[0]);
                        }}
                    />
                </>)}
            </div>

            <div className="flex flex-col items-center lg:flex-row lg:gap-6">

                {/* Аватар */}
                <div className="flex flex-col gap-2">
                    <div className="relative">

                        <div className="relative w-50 -mt-20 aspect-square rounded-full ring-4 ring-white shadow-[0_0_15px_rgba(0,0,0,0.3)] overflow-hidden">
                            <img
                                src={avatarUrl || "/NotFoundPurpleSquare.webp"}
                                alt="Аватар"
                                className="w-full h-full object-cover select-none pointer-events-none"
                            />
                        </div>

                        {onEdit && (<>
                            <button
                                onClick={() => avatarFileInputRef.current?.click()}
                                className="absolute left-0 top-0 w-50 -mt-20 aspect-square rounded-full hover:bg-black/10 transition cursor-pointer"
                            />
                            <button
                                type="button"
                                onClick={() => avatarFileInputRef.current?.click()}
                                className={clsx(
                                    "cursor-pointer absolute right-3 bottom-3 w-8.5 aspect-square rounded-full",
                                    "bg-gray-100 ring-1 ring-gray-300 flex items-center justify-center p-1.5",
                                    "hover:bg-gray-200 hover:ring-[#CDCFD1] transition duration-200 active:scale-95"
                                )}
                            >
                                <FaCamera className="w-full h-full text-primary-black" />
                            </button>

                            <input
                                ref={avatarFileInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                    if (e.target.files?.[0]) handleAvatarChange(e.target.files[0]);
                                }}
                            />
                        </>)}


                    </div>

                    {/* Внутрь поместить ^^ */}

                </div>

                {/* Інформація */}
                <div className="flex flex-col w-full items-center lg:items-start">

                    <div className="flex flex-col gap-2 py-2">
                        <p className="text-4xl font-normal">
                            {nickname}
                        </p>
                        <p className="text-sm font-normal text-gray-text">
                            на сайті з {formattedRegistrationDate}
                        </p>
                    </div>

                    <hr className="text-hr-clr w-full" />
                </div>

            </div>
        </>
    )
}
