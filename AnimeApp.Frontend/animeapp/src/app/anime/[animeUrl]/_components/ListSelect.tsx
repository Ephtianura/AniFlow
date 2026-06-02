"use client";

import {
    Combobox,
    ComboboxButton,
    ComboboxOption,
    ComboboxOptions,
} from "@headlessui/react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MyListEnum, MyListMap } from "@/core/enums/MyList";
import { apiFetch } from "@/lib/api";
import { useAnimeId } from "./animeIdProvider";
import { toast } from "react-toastify";

type Option = {
    value: string;
    label: string;
};

export default function ListSelect() {
    const { animeId, userAnime } = useAnimeId();
    const [myList, setMyList] = useState(userAnime?.myList ?? null)

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

    const [selected, setSelected] = useState<Option | null>(() => {
        if (!userAnime?.myList) return null;
        return Object.keys(MyListEnum)
            .filter(k => isNaN(Number(k)))
            .map(k => ({ value: k, label: MyListMap[k] }))
            .find(o => o.value === userAnime.myList) ?? null;
    });

    // Обновляет список
    const handleChange = async (option: Option | null) => {
        if (!userAnime) {
            toast.info("Будь ласка, увійдіть в акаунт, щоб додавати до списку");
            return;
        }
        if (option?.value !== "__remove__") {
            setSelected(option);
        }
        if (option?.value === "__remove__") {
          
            const prevList = option.value;
            const payload = { myList: true };
            setSelected(null);
            setMyList(null);
            try {
                await apiFetch(`/user/me/${animeId}`, {
                    method: "DELETE",
                    body: JSON.stringify(payload),
                });
            } catch (error) {
                setMyList(prevList);
                toast.error("Не вдалося прибрати зі списку :<");
            }
            return;
        }
        if (option) {
            const payload = { myList: option.value };
            const prevList = option.value;

            // Оптимистичный апдейт
            setMyList(option.value);
            try {
                await apiFetch(`/user/me/${animeId}`, {
                    method: "PATCH",
                    body: JSON.stringify(payload),
                });
            } catch (error) {
                setMyList(prevList);
                toast.error("Не вдалося додати до списку :<");
            }
        }
    };

    return (
        <Combobox value={selected} onChange={handleChange} >
            {({ open }) => (

                <div className="relative inline-block w-full select-none">
                    {/* BUTTON */}
                    <ComboboxButton
                        className="btn-primary transition-transform w-full text-left flex items-center justify-between cursor-pointer"
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

                                <ComboboxOptions static className="flex flex-col outline-none" modal={false}>
                                    {options.map((option) => {
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