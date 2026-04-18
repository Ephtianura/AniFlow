import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";


interface StudiosLayout {
    children: React.ReactNode;
}

export const StudiosLayout: React.FC<StudiosLayout> = ({ children }) => {
    const pathname = usePathname();

    const linkClasses = (path: string) =>
        `btn-primary text-center transition active:bg-gray-200 active:border-gray-300 ${pathname.startsWith(path)
            ? "bg-gray-100 border-gray-300 active:bg-gray-300 active:border-gray-400" //для активної силки
            : "" //для неактивної силки
        }`;

    return (
        <div>
            <h1 className="text-4xl font-extrabold mb-8 text-primary drop-shadow-sm text-center">
                Управління студіями
            </h1>
            <div className="flex flex-wrap sm:flex-nowrap gap-4 mb-6  justify-center">
                <Link href="/admin/studios/create" className={linkClasses("/admin/studios/create")}>
                    Створити
                </Link>

                <Link href="/admin/studios/update" className={linkClasses("/admin/studios/update")}>
                    Змінити
                </Link>

                <Link href="/admin/studios/delete" className={linkClasses("/admin/studios/delete")}>
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
