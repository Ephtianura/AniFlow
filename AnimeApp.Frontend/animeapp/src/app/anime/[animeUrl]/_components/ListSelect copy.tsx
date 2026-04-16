import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function DropdownButton() {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const toggle = () => setIsOpen((prev) => !prev);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    return (
        <div className="relative inline-block w-full" ref={containerRef}>
            <button
                className="btn-primary active:scale-95 transition-transform w-full"
                onClick={toggle}
            >
                меню
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{
                            duration: 0.4,
                            ease: [0.04, 0.62, 0.23, 0.98] 
                        }}
                        style={{ overflow: "hidden" }} 
                        className="absolute left-0 top-full mt-2 w-48 bg-white shadow-lg border rounded-lg origin-top"
                    >
                        <div className="p-2 flex flex-col">
                            <div className="p-2 hover:bg-gray-100 cursor-pointer rounded">Пункт 1</div>
                            <div className="p-2 hover:bg-gray-100 cursor-pointer rounded">Пункт 2</div>
                            <div className="p-2 hover:bg-gray-100 cursor-pointer rounded">Пункт 3</div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}