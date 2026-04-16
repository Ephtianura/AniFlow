"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { TbLogout, TbLogin } from "react-icons/tb";

export default function LoginButtons() {
    const { isLoggedIn, logout } = useAuth();

    return (
        <div>
            {isLoggedIn ? (
                // ===== Вийти =====
                <button
                    onClick={logout}
                    className="flex items-center gap-1 bg-btn-primary-hover rounded-[10px] 
              px-3 py-2 hover:text-btn-hover-dark transition-colors duration-200 cursor-pointer"
                >
                    <TbLogout className="w-5 h-5" />
                    <p>Вийти</p>
                </button>
            ) : (
                // ===== Увійти =====
                <Link
                    href="/login"
                    className="flex items-center gap-1 bg-btn-primary-hover rounded-[10px] px-3 py-2 
              hover:text-btn-hover-dark transition-colors duration-200"
                >
                    <TbLogin className="w-5 h-5" />
                    <p>Увійти</p>
                </Link>
            )}
        </div>
    )
}
