"use client";

import { UserMeResponse } from "@/core/types";
import { RxHamburgerMenu } from "react-icons/rx";
import BurgerMenu from "./BurgerMenu";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
type Props = {
    me: UserMeResponse | null
}
export default function BurgerMenuButton({ me }: Props) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <button onClick={() => setIsOpen(prev => !prev)} >
                <RxHamburgerMenu className="w-9 h-9 active:scale-95 transition" />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <BurgerMenu
                        me={me}
                        onClose={() => setIsOpen(false)}
                    />
                )}
            </AnimatePresence>
        </>
    )
}
