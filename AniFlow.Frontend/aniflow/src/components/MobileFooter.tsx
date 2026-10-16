import Link from 'next/link';
import { LuYoutube } from "react-icons/lu";
import { FiHome } from "react-icons/fi";
import { LuLibraryBig } from "react-icons/lu";
import MobileRandomButton from './MobileRandomButton'; // Импортируем нашу кнопку
import clsx from 'clsx';

const footerItems = [
    { href: "/", label: "Головна", icon: FiHome, },
    { href: "/animes", label: "Аніме", icon: LuYoutube, },
    // { href: "", label: "Налаштування", icon: LuDices, },
];
// dark:bg-[#242525]
// dark:border-t-1 dark:border-[#373838]

export default function MobileFooter() {
    return (
        <nav className={clsx(
            "fixed bottom-0 left-0 right-0 z-30 px-3 py-1.5 h-16 ",
            "bg-bg-dark text-gray-200 border-t-3 border-primary",
            "flex justify-around items-center md:hidden select-none"
        )}>
            {footerItems.map((item) => {
                const Icon = item.icon;
                return (
                    <Link
                        key={item.label}
                        href={item.href}
                        className={`flex flex-col gap items-center px-3 `}
                    >
                        <Icon className='w-5.5 h-5.5' />
                        <span className='text-[11px]'>{item.label}</span>
                    </Link>
                );
            })}

            <MobileRandomButton />

            <Link
                href="/profile"
                className="hidden xs:flex flex-col gap items-center px-3 "
            >
                <LuLibraryBig className='w-5.5 h-5.5' />
                <span className='text-[11px]'>Профіль</span>
            </Link>
        </nav>
    );
}