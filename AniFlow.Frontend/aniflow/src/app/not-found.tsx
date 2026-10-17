import Link from "next/link";

export const metadata = {
    title: "404 – Сторінка не знайдена | AniFlow",
    description:
        "Шкода, але такої сторінки не існує.",

    openGraph: {
        title: "404 – Сторінка не знайдена | AniFlow",
        description:
            "Шкода, але такої сторінки не існує. Спробуйте повернутися на головну.",
        images: [
            {
                url: "/NotFoundPurple.webp",
                alt: "Сторінка не знайдена – AniFlow",
            },
        ],
    },

    twitter: {
        card: "summary_large_image",
        title: "404 – Сторінка не знайдена | AniFlow",
        description:
            "Шкода, але такої сторінки не існує. Спробуйте повернутися на головну.",
        images: ["/NotFoundBannerPurple.webp"],
    },
};

export default function NotFound() {
    return (
        <main className="flex flex-col items-center justify-center text-center">
            <h1 className="text-7xl text-primary font-bold mb-4">404</h1>
            <h2 className="text-4xl font-medium mb-4">Сторінка не знайдена</h2>
            <div className="text-gray-500">
                <p >Шкода, але такої сторінки не існує. </p>
                <p>
                    Швидше за все, ви потрапили сюди через помилку в адресі сторінки.
                </p>
            </div>

            <Link href="/" className="text-primary hover:underline mb-6">
                Спробуйте повернутись на головну
            </Link>
            <img src="/404.gif" alt="" />
        </main>
    );
}
