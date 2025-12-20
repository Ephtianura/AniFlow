// app/error.tsx
"use client";

import { useEffect } from "react";
import Link from "next/link";
export default function ErrorPage({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error("Помилка на сторінці:", error);
  }, [error]);

  return (
    <main className="flex flex-col items-center justify-center text-center">
            <h1 className="text-7xl text-primary font-bold mb-4">500</h1>
            <h2 className="text-4xl font-medium mb-4">Внутрішня помилка сервера</h2>
            <div className="text-gray-500">
                <p>
                    Виникла внутрішня помилка сервера. Ми зараз докладаємо всіх зусиль для її усунення. 
                    Спробуйте відвідати сайт пізніше.
                </p>
            </div>
        </main>
  );
}
