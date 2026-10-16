// app/error.tsx
'use client'

import { getKawaiiError, KawaiiErrorType } from "@/hooks/getKawaiiError";

export default function ErrorPage({ error, reset }: { error: Error; reset: () => void }) {
    const kawaiError = getKawaiiError(KawaiiErrorType.Server)

    return (
        <main className="flex flex-col items-center justify-center text-center">
            <h1 className="text-7xl text-primary font-bold mb-4">500</h1>
            <h2 className="text-4xl font-medium mb-4">{kawaiError}</h2>
            <div className="text-gray-500">
                <p>
                    Виникла внутрішня помилка сервера. Ми зараз докладаємо всіх зусиль для її усунення.
                    Спробуйте відвідати сайт пізніше.
                </p>
            </div>

            {process.env.NODE_ENV === 'development' && (
                <pre>{error.message}</pre>
            )}
        </main>
    );
}
