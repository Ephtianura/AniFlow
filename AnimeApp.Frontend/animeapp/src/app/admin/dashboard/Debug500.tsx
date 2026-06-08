"use client";

import { useState } from "react";

export default function Debug500() {
    const [boom, setBoom] = useState(false);

    if (boom) {
        throw new Error("Test 500 error");
    }

    return (
        <div className="flex gap-2 items-center">
            <button
                onClick={() => setBoom(true)}
                className={`px-4 py-2 w-30 rounded-lg bg-red-300 text-white font-semibold hover:bg-red-400 border-2 border-red-400
                active:bg-red-700 cursor-pointer transition select-none`}
            >
                Throw 💥
            </button>
            <p className="text-sm text-gray-600 max-w-sm">
                Ця кнопка використовується для тестування error сторінки 500.
                Після натискання застосунок навмисно впаде.
            </p>
        </div>

    );
}