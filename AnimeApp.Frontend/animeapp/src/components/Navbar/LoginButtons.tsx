"use client";

import Link from "next/link";
import { TbLogout, TbLogin } from "react-icons/tb";
import clsx from "clsx";
import { UserMeResponse } from "@/core/types";
import { logout } from "@/hooks/logout";

type Props = {
    me: UserMeResponse | null
}

export default function UserAvatar({ me }: Props) {
    return (
        <div>
            {me?.id ? (
                // ===== Вийти =====
                <button
                    onClick={logout}
                    className={clsx(
                        "hidden lg:flex items-center gap-1 bg-btn-primary-hover rounded-[10px]",
                        "px-3 py-2 hover:text-btn-hover-dark transition-colors duration-200 cursor-pointer"
                    )}>
                    <TbLogout className="w-6 h-6" />
                    <p>Вийти</p>
                </button>
            ) : (
                // ===== Увійти =====
                <Link
                    href="/login"
                    className={clsx(
                        "hidden md:flex items-center gap-1 bg-btn-primary-hover rounded-[10px] px-3 py-2",
                        "hover:text-btn-hover-dark transition-colors duration-200"
                    )}>
                    <TbLogin className="w-6 h-6" />
                    <p>Увійти</p>
                </Link>
            )}
        </div>
    )
}
