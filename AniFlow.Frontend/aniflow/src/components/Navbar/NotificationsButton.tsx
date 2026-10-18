'use client';

import { useState, useEffect, useRef } from 'react';
import clsx from 'clsx';
import { RiNotificationFill } from 'react-icons/ri';
import { apiFetch } from '@/lib/api';
import { PendingRequestResponse } from '@/core/types';
import NotificationsDropdown from './NotificationsDropdown';
import { AnimatePresence, motion } from "motion/react";

type Props = {
    unreadCount: number;
}

export default function NotificationsButton({ unreadCount }: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const [requests, setRequests] = useState<PendingRequestResponse[]>([]);
    const [loaded, setLoaded] = useState(false);
    const [count, setCount] = useState(unreadCount);

    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                setRequests((prev) => prev.filter(req => !(req as any).isAccepted));
            }
        }
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const handleClick = async () => {
        const next = !isOpen;
        setIsOpen(next);
        if (!next) {
            setRequests((prev) => prev.filter(req => !(req as any).isAccepted));
        }
        if (next && !loaded) {
            try {
                const data = await apiFetch<PendingRequestResponse[]>('/friends/requests');
                setRequests(data)
                setLoaded(true);
            } catch { }
        }
    };

    const handleRemoveRequest = (userId: number) => {
        setCount((prev) => Math.max(0, prev - 1));
        setRequests((prev) => prev.filter(req => req.userId !== userId));
    };

    const handleDecrementCount = () => {
        setCount((prev) => Math.max(0, prev - 1));
    };

    const [isDesktop, setIsDesktop] = useState(false);
    useEffect(() => {
        const mediaQuery = window.matchMedia("(min-width: 768px)");
        const handleChange = () => setIsDesktop(mediaQuery.matches);
        handleChange();
        mediaQuery.addEventListener("change", handleChange);
        return () => mediaQuery.removeEventListener("change", handleChange);
    }, []);

    return (
        <div ref={containerRef} className=" relative text-primary-black">
            <button onClick={handleClick} className="cursor-pointer group relative">
                <RiNotificationFill
                    className={clsx(
                        'w-5 xs:w-6 lg:w-5 h-7 text-gray-400',
                        'hover:text-btn-hover-dark transition group-active:scale-95 duration-200',
                        count > 0 && 'text-white'
                    )}
                />

                {count > 0 && (
                    <span className={`absolute -top-1 -right-1 min-w-4.25 h-4.25 px- bg-red-500 text-white text-[10px]
                        font-bold rounded-full flex items-center justify-center border border-[#1e1e24]
                        shadow-md select-none`}
                    >
                        {count}
                    </span>
                )}
            </button>

            {/* На телефонах анімація випадіння згори. */}
            <div className={`fixed left-1/2 -translate-x-1/2 w-screen 
            md:absolute md:left-auto md:translate-x-0 md:inset-x-auto md:top-full md:right-0 
            mt-3.5 md:mt-2 md:w-105 z-51`}>
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ y: isDesktop ? 0 : "-130%" }}
                            animate={{ y: 0 }}
                            exit={{ y: isDesktop ? 0 : "-150%" }}
                            transition={{
                                duration: 0.30,
                                ease: "easeOut",
                            }}
                        >
                            <NotificationsDropdown
                                requests={requests}
                                onRemoveRequest={handleRemoveRequest}
                                onDecrementCount={handleDecrementCount}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

        </div>
    );
}