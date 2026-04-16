"use client";

import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

export default function AdminButton() {
  const { userRole } = useAuth();

    return (
        <div>
            {userRole === "Admin" && (
                <div>
                    <Link
                        href="/admin/dashboard"
                        className="nav-button"
                    >
                        Адмін-панель
                    </Link>
                </div>
            )}
        </div>
    )
}
