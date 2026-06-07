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
                border-2 border-primary text-primary px-6 py-2 rounded font-bold
                transition-colors duration-200 w-full
                enabled:cursor-pointer
                enabled:hover:bg-purple-600 enabled:hover:text-white enabled:hover:border-purple-700
                enabled:active:bg-purple-700 enabled:active:border-purple-800 enabled:active:text-white
                disabled:opacity-50 disabled:cursor-auto select-none
                
                ${className}
            `}
        >
            {children}
        </button>
    );
}