"use client";

import React from "react";

interface PrimaryButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    type?: "button" | "submit" | "reset";
    disabled?: boolean;
    className?: string; 
}

export function PrimaryButton({
    children,
    onClick,
    type = "button",
    disabled = false,
    className = "",
}: PrimaryButtonProps) {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`
                border-2 border-primary text-primary px-6 py-2 rounded font-bold cursor-pointer
                hover:bg-purple-600 hover:text-white hover:border-purple-700
                active:bg-purple-700 active:border-purple-800
                transition-colors duration-200 w-full
                disabled:opacity-50 
                ${className}
            `}
        >
            {children}
        </button>
    );
}
