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
import { useUserAnimeStore } from "@/stores/useUserAnimeStore";
import { useAnimeId } from "./animeIdProvider";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-toastify";

type Option = {
    value: string;
    label: string;
};

export default function ListSelect() {
    const animeId = useAnimeId();
    const item = useUserAnimeStore((s) => s.data[animeId]);
    const updateList = useUserAnimeStore((s) => s.updateField);
    const myList = item?.data?.myList ?? null;
    const { isLoggedIn } = useAuth();

    const options: Option[] = [
        ...Object.keys(MyListEnum)
            .filter((key) => isNaN(Number(key)))
            .map((key) => ({
                value: key,
                label: MyListMap[key],
            })),
        ...(myList != null
            ? [
                {
                    value: "__remove__",
                    label: "Видалити зі списку",
                },
            ]
            : []),
    ];

    const [selected, setSelected] = useState<Option | null>(null);

    useEffect(() => {
        if (!myList) {
            setSelected(null);
            return;
        }
        const found = options.find((o) => o.value === myList);
        setSelected(found ?? null);
    }, [myList]);

    // Обновляет список
    const handleChange = async (option: Option | null) => {
        if (!isLoggedIn) {
            toast.info("Будь ласка, увійдіть в акаунт, щоб додавати до списку");
            return;
        }
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
            updateList(animeId, { myList: null });
            return;
        }
        if (option) {
            const payload = { myList: option.value };

            const prevRating = option.value;

            // Оптимистичный апдейт
            updateList(animeId, { myList: option.value });

            try {
                // Запрос на бэк
                await apiFetch(`/user/me/${animeId}`, {
                    method: "PATCH",
                    body: JSON.stringify(payload),
                });
            } catch (error) {
                // Откат в случае ошибки
                updateList(animeId, { myList: option.value });
                toast.error("Не вдалося додати до списку :<");
            }
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