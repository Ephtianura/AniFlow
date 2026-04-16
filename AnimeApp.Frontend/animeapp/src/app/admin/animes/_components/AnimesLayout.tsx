import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";


interface AnimesLayout {
    children: React.ReactNode;
}

export const AnimesLayout: React.FC<AnimesLayout> = ({ children }) => {
    const pathname = usePathname();

    const linkClasses = (path: string) =>
        `btn-primary text-center transition active:bg-gray-200 active:border-gray-300 ${pathname.startsWith(path)
            ? "bg-gray-100 border-gray-300 active:bg-gray-300 active:border-gray-400" //для активної силки
            : "" //для неактивної силки
        }`;

    return (
        <div>
            <h1 className="text-4xl font-extrabold mb-8 text-primary drop-shadow-sm text-center">
                Управління Аніме
            </h1>
            <div className="flex gap-4 mb-6">
                <Link href="/admin/animes/create" className={linkClasses("/admin/animes/create")}>
                    Створити
                </Link>

                <Link href="/admin/animes/update" className={linkClasses("/admin/animes/update")}>
                    Змінити
                </Link>

                <Link href="/admin/animes/delete" className={linkClasses("/admin/animes/delete")}>
                    Видалити
                </Link>
            </div>

            <hr className="text-hr-clr my-6" />

            <div>
                {children}
            </div>
        </div>
    );
};
