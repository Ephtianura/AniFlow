import { useEffect } from "react";

export function useLockBodyOverflow(isOpen: boolean, isMini: boolean) {
    useEffect(() => {
        if (!isMini && isOpen) {
            const originalHtmlOverflow = document.documentElement.style.overflow;
            const originalBodyOverflow = document.body.style.overflow;
            document.documentElement.style.overflow = "hidden";
            document.body.style.overflow = "hidden";
            return () => {
                document.documentElement.style.overflow = originalHtmlOverflow;
                document.body.style.overflow = originalBodyOverflow;
            };
        }
    }, [isMini, isOpen]);
}