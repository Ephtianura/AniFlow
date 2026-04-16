"use client";

import {
    Combobox,
    ComboboxButton,
    ComboboxOption,
    ComboboxOptions,
} from "@headlessui/react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MyListEnum, MyListMap } from "@/core/MyList";
import { apiFetch } from "@/lib/api";

type Option = {
    value: string;
    label: string;
};

type Props = {
    animeId: number;
    initialStatus?: string | null;
};

export default function ListSelect({ animeId, initialStatus }: Props) {
    const options: Option[] = [
        ...Object.keys(MyListEnum)
            .filter((key) => isNaN(Number(key)))
            .map((key) => ({
                value: key,
                label: MyListMap[key],
            })),
        {
            value: "__remove__",
            label: "Видалити зі списку",
        },
    ];

    const [selected, setSelected] = useState<Option | null>(null);

    useEffect(() => {
        if (!initialStatus) {
            setSelected(null);
            return;
        }
        const found = options.find((o) => o.value === initialStatus);
        setSelected(found ?? null);
    }, [initialStatus]);

    const handleChange = async (option: Option | null) => {

        if (option?.value !== "__remove__") {
            setSelected(option);
        }
        if (option?.value === "__remove__") {
            const query = new URLSearchParams({
                List: "true",
            }).toString();

            await apiFetch(`/user/me/${animeId}?${query}`, {
                method: "DELETE",
            });

            setSelected(null);
            return;
        }
        if (option) {
            const payload = { myList: option.value };

            await apiFetch(`/user/me/${animeId}`, {
                method: "PATCH",
                body: JSON.stringify(payload),
            });
        }
    };

    return (
        /* open — это встроенное состояние Headless UI */
        <Combobox value={selected} onChange={handleChange}>
            {({ open }) => (
                <div className="relative inline-block w-full">
                    {/* BUTTON */}
                    <ComboboxButton
                        className="btn-primary transition-transform w-full text-left flex items-center justify-between"
                    >
                        <span>
                            {selected ? selected.label : "Додати до списку"}
                        </span>
                    </ComboboxButton>

                    <AnimatePresence>
                        {open && (
                            <motion.div
                                initial={{ height: 0 }}
                                animate={{ height: "auto" }}
                                exit={{ height: 0 }}
                                transition={{
                                    duration: 0.4,
                                    ease: [0.04, 0.62, 0.23, 0.98]
                                }}
                                style={{ overflow: "hidden" }}
                                className="absolute left-0 top-full w-full bg-white shadow-lg border border-hr-clr origin-top z-50 rounded-xs"
                            >

                                <ComboboxOptions static className="flex flex-col outline-none">
                                    {options.map((option) => {
                                        // Проверяем, является ли эта опция кнопкой удаления
                                        const isRemove = option.value === "__remove__";

                                        return (
                                            <ComboboxOption
                                                key={option.value}
                                                value={option}
                                                className={`px-5 py-2 border-b border-hr-clr cursor-pointer transition-colors text-sm
                                                 ${isRemove
                                                        ? "text-red-600 hover:bg-red-50 data-focus:bg-red-50 font-medium"
                                                        : "text-primary-black hover:bg-gray-100 data-focus:bg-gray-100"
                                                    }
                                                `}
                                            >
                                                {option.label}
                                            </ComboboxOption>
                                        );
                                    })}
                                </ComboboxOptions>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            )}
        </Combobox>
    );
}