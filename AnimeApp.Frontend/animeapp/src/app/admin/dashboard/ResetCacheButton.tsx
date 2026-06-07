"use client";

import { useState } from "react";
import Checkbox from "@mui/material/Checkbox";
import { red } from "@mui/material/colors";
import { IoWarning } from "react-icons/io5";
import { apiFetch } from "@/lib/api";
import { toast } from "react-toastify";

export default function ResetCacheButton() {
    const [confirmed, setConfirmed] = useState(false);
    const [cooldown, setCooldown] = useState(0);

    const handleClick = async () => {
        if (!confirmed || cooldown > 0) return;

        setCooldown(5);

        try {
            await apiFetch("/admin/cache/clear", { method: "POST" })
            toast.success("Кеш успішно очищений");
        } catch {
            toast.error("Не вдалося очистити кеш");
        }
        finally {
            const interval = setInterval(() => {
                setCooldown((prev) => {
                    if (prev <= 1) {
                        clearInterval(interval);
                        return 0;
                    }

                    return prev - 1;
                });
            }, 1000);
        }
    };

    return (
        <div className="max-w-md rounded-xl border border-red-300 bg-red-50 p-4 space-y-4 flex flex-col ">
            <div className="grow">
                <h3 className="font-semibold text-red-700 flex gap-2 items-center">
                    <IoWarning className="text-amber-300 w-7 h-7" /> Очищення кешу
                </h3>

                <p className="mt-1 text-sm text-gray-600">
                    Усі кешовані дані про аніме буде видалено. Після очищення можливе
                    тимчасове збільшення навантаження на сервер та повільніше
                    завантаження сторінок.
                </p>
            </div>

            <div className="mt-auto flex flex-col gap-3">
                <button
                    onClick={handleClick}
                    disabled={!confirmed || cooldown > 0}
                    className="btn-red w-full text-white font-semibold disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {cooldown > 0
                        ? `Зачекайте ${cooldown}с...`
                        : "Очистити кеш"}
                </button>

                <label className="flex items-start gap-3 text-sm cursor-pointer">
                    <Checkbox
                        checked={confirmed}
                        onChange={(e) => setConfirmed(e.target.checked)}
                        sx={{
                            color: red[800],
                            "&.Mui-checked": {
                                color: red[600],
                            },
                        }}
                        className="mt-0.5 h-4 w-4"
                    />

                    <span>
                        Я впевнений, що хочу очистити весь аніме кеш сайту
                    </span>
                </label>
            </div>

        </div>
    );
}