import { IoClose } from "react-icons/io5";
import { LuPencilLine } from "react-icons/lu";
import clsx from "clsx";

type Props = {
    text: string;
    mode?: "edit" | "delete";
    isActive?: boolean;
    onClick?: () => void;
    className?: string;
};

export default function GenreCapsule({
    text,
    mode,
    isActive = false,
    onClick,
    className,
}: Props) {
    return (
        <div
            onClick={onClick}
            className={clsx(
                "flex items-center gap-2 px-3 py-1 rounded-full shadow-sm cursor-pointer",
                "transition active:scale-95 select-none",

                isActive
                    ? "bg-purple-500 text-white hover:bg-purple-600 active:bg-purple-700"
                    : "bg-gray-200 hover:bg-gray-300 active:bg-gray-400",

                className
            )}
        >
            <span>{text}</span>

            {mode === "edit" && (
                <LuPencilLine
                    className={clsx(
                        "w-5 h-5",
                        isActive ? "text-white" : "text-gray-text-dark"
                    )}
                />
            )}

            {mode === "delete" && (
                <IoClose
                    className={clsx(
                        "w-5 h-5",
                        isActive ? "text-white" : "text-red-400"
                    )}
                />
            )}
        </div>
    );
}