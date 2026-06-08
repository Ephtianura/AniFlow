"use client";

import { useState } from "react";
import Checkbox from '@mui/material/Checkbox';
import { FaStar } from "react-icons/fa";
import { apiFetch } from "@/lib/api";
import { toast } from "react-toastify";
import { purple } from "@mui/material/colors";

export default function RecalculateRatingButton() {
    const [confirmed, setConfirmed] = useState(false);
    const [cooldown, setCooldown] = useState(0);

    const handleClick = async () => {
        if (!confirmed || cooldown > 0) return;

        setCooldown(5);

        try {
            await apiFetch("/anime/recalculate-ratings", { method: "POST" })
            toast.success("Рейтинг успішно перехрахований");
        } catch {
            toast.error("Не вдалося перерахувати рейтинг :(");

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
        <div className="max-w-md rounded-xl border border-hr-clr bg-gray-50 p-4 space-y-4 flex flex-col">
            <div className="">
                <h3 className="font-semibold  flex gap-2 items-center">
                    <FaStar className="w-6 h-6 text-purple-700" /> Перерахунок рейтингу
                </h3>

                <p className="mt-1 text-sm text-gray-600">
                    Ця дія перерахує рейтинг для всіх аніме та може зайняти
                    деякий час.
                </p>
            </div>

            <div className="mt-auto flex flex-col gap-3">
                <button
                    onClick={handleClick}
                    disabled={!confirmed || cooldown > 0}
                    className="btn-purple w-full text-white font-semibold disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {cooldown > 0
                        ? `Зачекайте ${cooldown}с...`
                        : "Перерахувати рейтинг"}
                </button>

                <label className="flex items-start gap-3 text-sm cursor-pointer">
                    <Checkbox
                        checked={confirmed}
                        onChange={(e) => setConfirmed(e.target.checked)}
                        color="secondary"
                        className="mt-0.5 h-4 w-4"
                        sx={{
                            color: purple[800],
                        }}
                    />
                    <span>
                        Я впевнений, що хочу перерахувати рейтинг для всіх аніме
                    </span>
                </label>
            </div>

        </div>
    );
}