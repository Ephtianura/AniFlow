interface OnlineIndicatorProps {
    isOnline: boolean;
    className?: string;
}

export default function OnlineIndicator({ isOnline, className }: OnlineIndicatorProps) {
    return (
        <span
            className={`absolute bottom-1 right-2 w-5 h-5 rounded-full border-2 border-white shadow-inner shadow-black/10
                ${isOnline ? "bg-[#22b06e]" : "bg-gray-400"} ${className}`}
        />
    );
}