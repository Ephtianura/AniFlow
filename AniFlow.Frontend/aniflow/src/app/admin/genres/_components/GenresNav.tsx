"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function GenresNav() {
    const pathname = usePathname();

    const linkClasses = (path: string) =>
        `btn-primary text-center transition active:bg-gray-200 active:border-gray-300 ${
            pathname.startsWith(path)
                ? "bg-gray-100 border-gray-300 active:bg-gray-300 active:border-gray-400"
                : ""
        }`;

    return (
        <div className="flex flex-wrap sm:flex-nowrap gap-4 mb-6 justify-center">
            <Link href="/admin/genres/create" className={linkClasses("/admin/genres/create")}>
                Створити
            </Link>

            <Link href="/admin/genres/update" className={linkClasses("/admin/genres/update")}>
                Редагувати
            </Link>

            <Link href="/admin/genres/delete" className={linkClasses("/admin/genres/delete")}>
                Видалити
            </Link>
        </div>
    );
}