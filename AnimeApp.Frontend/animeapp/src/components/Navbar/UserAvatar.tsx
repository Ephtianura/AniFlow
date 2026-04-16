"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function UserAvatar() {
    const { isLoggedIn, userName } = useAuth();

    return (
        <div >
            {isLoggedIn && userName && (
                <Link
                    href="/profile"
                    className="nav-button flex items-center gap-2"
                >
                    <div className="w-8 aspect-square rounded-full flex items-center justify-center overflow-hidden shrink-0">
                        <img
                            src="/NotFound.jpg"
                            className="w-full h-full object-cover shrink-0"
                            alt="Avatar"
                        />
                    </div>

                    <span className="hidden sm:block">{userName}</span>
                </Link>
            )}
        </div>
    )
}
