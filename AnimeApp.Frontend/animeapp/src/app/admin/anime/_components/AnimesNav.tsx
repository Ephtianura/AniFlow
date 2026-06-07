"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function AnimesNav() {
    const pathname = usePathname();

    const linkClasses = (path: string) =>
        `btn-primary text-center transition active:bg-gray-200 active:border-gray-300 ${
            pathname.startsWith(path)
                ? "bg-gray-100 border-gray-300 active:bg-gray-300 active:border-gray-400"
                : ""
        }`;

    return (
        <div className="flex flex-wrap sm:flex-nowrap gap-4 mb-6 justify-center">
            <Link href="/admin/anime/create" className={linkClasses("/admin/anime/create")}>
                Створити вручну
            </Link>

            <Link href="/admin/anime/update" className={linkClasses("/admin/anime/update")}>
                Змінити
            </Link>

            <Link href="/admin/anime/delete" className={linkClasses("/admin/anime/delete")}>
                Видалити
            </Link>
        </div>
    );
}