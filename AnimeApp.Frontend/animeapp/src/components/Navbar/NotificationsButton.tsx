'use client';

import { useState, useEffect, useRef } from 'react';
import clsx from 'clsx';
import { RiNotificationFill } from 'react-icons/ri';
import { apiFetch } from '@/lib/api';
import { PendingRequestResponse } from '@/core/types';
import NotificationsDropdown from './NotificationsDropdown';
 
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
                setRequests(data);
                setLoaded(true);
            } catch (err: any) { }
        }
    };

    const handleRemoveRequest = (userId: number) => {
        setCount((prev) => Math.max(0, prev - 1));
        setRequests((prev) => prev.filter(req => req.userId !== userId));
    };

    const handleDecrementCount = () => {
        setCount((prev) => Math.max(0, prev - 1));
    };

    return (
        <div ref={containerRef} className="hidden lg:flex px-4 relative text-primary-black">
            <button onClick={handleClick} className="cursor-pointer group relative">
                <RiNotificationFill
                    className={clsx(
                        'w-8 h-8 lg:w-5 lg:h-7 text-gray-400',
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

            {isOpen && (
                <NotificationsDropdown
                    requests={requests}
                    onRemoveRequest={handleRemoveRequest}
                    onDecrementCount={handleDecrementCount}
                />
            )}
        </div>
    );
}