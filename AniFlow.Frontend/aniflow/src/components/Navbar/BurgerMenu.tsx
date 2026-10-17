"use client";

import { UserMeResponse } from "@/core/types";
import Link from "next/link";
import { useEffect } from "react";
import { IoCloseSharp } from "react-icons/io5";
import { LuSettings, LuShieldMinus } from "react-icons/lu";
import { TbLogout, TbLogin } from "react-icons/tb";
import { logout } from "@/hooks/logout";
import { UserRole } from "@/core/enums/UserRole";
import { FiHome } from "react-icons/fi";
import { LuLibraryBig } from "react-icons/lu";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from 'react-dom';
import { RiNotificationFill } from "react-icons/ri";

type Props = {
    me: UserMeResponse | null;
    onClose: () => void;
};

export default function BurgerMenu({ me, onClose }: Props) {
    useEffect(() => {
        const scrollY = window.scrollY;

        document.body.style.position = "fixed";
        document.body.style.top = `-${scrollY}px`;
        document.body.style.left = "0";
        document.body.style.right = "0";
        document.body.style.width = "100%";
        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.position = "";
            document.body.style.top = "";
            document.body.style.left = "";
            document.body.style.right = "";
            document.body.style.width = "";
            document.body.style.overflow = "";

            window.scrollTo(0, scrollY);
        };
    }, []);

    const currentYear = new Date().getFullYear()
    const prevYear = new Date().getFullYear() - 1
    return createPortal(
        <div className="fixed left-0 top-0 w-full h-full z-50 pointer-events-none select-none">

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute left-0 top-0 bg-primary-black/50 w-full h-full z-10 pointer-events-auto"
                onClick={onClose}
            />

            <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{
                    duration: 0.25,
                    ease: "easeOut",
                }}
                className="relative h-full w-full max-w-100 z-50 pointer-events-auto"
            >
                <div className="bg-bg-dark flex flex-col h-full border-r-3 border-primary ">
                    <div className="flex items-center justify-center relative p-4 text-white">
                        <Link href={"/"} className="text-2xl">AniFlow</Link>

                        <button className="absolute right-2 text-xl p-2 active:scale-95 transition" onClick={onClose}>
                            <IoCloseSharp className="w-8 h-8" />
                        </button>
                    </div>
                    <div className="p-4 flex flex-col gap-3 text-[1.25rem] text-[#dee2e6]">
                        <div className="flex flex-col gap-2">
                            {me && (<>
                                <Link href={"/profile"} onClick={onClose} className="slider-btn">
                                    <LuLibraryBig />
                                    Профіль
                                </Link>
                                {/* <Link href={"/profile/edit"} onClick={onClose} className="slider-btn">
                                    <RiNotificationFill />
                                    Сповіщення
                                </Link> */}
                                <Link href={"/profile/edit"} onClick={onClose} className="slider-btn">
                                    <LuSettings />
                                    Налаштування
                                </Link>
                                <button onClick={logout} className="slider-btn text-[#dc3545]">
                                    <TbLogout />
                                    Вийти
                                </button>
                            </>)}

                            {!me && (<>
                                <Link href={"/"} onClick={onClose} className="slider-btn">
                                    <FiHome />
                                    Головна
                                </Link>
                                <Link href={"/login"} onClick={onClose} className="slider-btn">
                                    <TbLogin />
                                    Увійти
                                </Link>
                            </>)}
                        </div>

                        <hr className="text-hr-clr opacity-30" />

                        <div className="flex flex-col gap-2 ">
                            <Link href={"/animes"} onClick={onClose} className="px-4 py-2">Аніме</Link>
                            <Link href={{ pathname: "/animes", query: { status: "ongoing" } }} onClick={onClose} className="px-4 py-2">Онгоінг</Link>
                            <Link href={{ pathname: "/animes", query: { year: `${prevYear}` } }} onClick={onClose} className="px-4 py-2">{prevYear}</Link>
                            <Link href={{ pathname: "/animes", query: { year: `${currentYear}` } }} onClick={onClose} className="px-4 py-2">{currentYear}</Link>
                        </div>

                        <hr className="text-hr-clr opacity-30" />

                        {me && me.role === UserRole.Admin && (<>
                            <Link href={"/admin/dashboard"} onClick={onClose} className="slider-btn">
                                <LuShieldMinus />
                                Адмін панель
                            </Link>
                        </>)}

                    </div>
                </div>
            </motion.div>
        </div>,
        document.body

    )
}
