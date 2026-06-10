'use client';

import { useEffect, useRef, useState } from 'react';
import { FiShare2 } from 'react-icons/fi';

type Props = {
    userId: number | string;
};

export default function ShareProfileButton({ userId }: Props) {
    const [copied, setCopied] = useState(false);

    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const handleClick = async () => {
        await navigator.clipboard.writeText(
            `${window.location.origin}/user/${userId}`
        );

        setCopied(true);

        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
            setCopied(false);
            timeoutRef.current = null;
        }, 2000);
    };

    useEffect(() => {
        return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };
    }, []);

    return (
        <button
            onClick={handleClick}
            className={`flex items-center gap-2 rounded-lg bg-white/50 px-3 py-2 text-sm font-medium shadow-md 
            transition-all hover:bg-white hover:shadow-lg cursor-pointer active:scale-95 duration-200 select-none`}
        >
            <FiShare2 className="h-4 w-4" />
            <span>{copied ? 'Скопійовано!' : 'Поділитися'}</span>
        </button>
    );
}