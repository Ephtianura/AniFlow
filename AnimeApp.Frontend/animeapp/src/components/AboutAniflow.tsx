import Link from "next/link";

export default function AboutAniflow() {

    return (
        <div>

            <h1 className="text-[2.5rem] font-medium mb-2">AniFlow – дивитися аніме онлайн українською</h1>

            <p>
                Аніме вже давно стало чимось більшим, ніж просто японська анімація. Для когось це улюблені персонажі та історії, для когось – музика, атмосфера й емоції, які залишаються в пам’яті надовго.
            </p>
            <p className="mb-4">
                Саме тому ми створили AniFlow – сучасний аніме-портал для 
                <span className="font-semibold"> української аудиторії</span>
                , де все зібрано в одному місці та зроблено з любов’ю до цього жанру.
            </p>

            <p className="mb-2">
                На AniFlow ви можете
                <span className="font-semibold"> безкоштовно </span>
                дивитися аніме онлайн у хорошій якості без реєстрації та
                <span className="font-semibold"> без нав’язливої реклами</span>.
                Ми постаралися зробити сайт максимально швидким, зручним і приємним у використанні, щоб ніщо не відволікало від перегляду улюблених тайтлів.
            </p>

            <p className="mb-4">
                У каталозі доступні популярні аніме, новинки сезону, фільми та серіали різних жанрів.
                Зручна навігація допоможе легко знайти саме те, що хочеться подивитися сьогодні –
                <span> від </span>
                <Link className="primary-link" href={{ pathname: "/animes", query: { genres: "romance", } }}>
                    романтики
                </Link>
                <span> й </span>
                <Link className="primary-link" href={{ pathname: "/animes", query: { genres: "comedy", } }}>
                    комедії
                </Link>
                <span> до </span>
                <Link className="primary-link" href={{ pathname: "/animes", query: { genres: "action", } }}>
                    екшену
                </Link>
                <span>, </span>
                <Link className="primary-link" href={{ pathname: "/animes", query: { genres: "drama", } }}>
                    драм
                </Link>
                <span> та </span>
                <Link className="primary-link" href={{ pathname: "/animes", query: { genres: "fantasy", } }}>
                    фентезі
                </Link>
                <span>.</span>
            </p>

            <h4 className="h4 mb-2">
                Окрім перегляду аніме, на AniFlow можна:
            </h4>

            <ul className="list-disc pl-8 space-y-2 mb-2">
                <li>Слухати <span className="font-semibold">OST’и </span> з улюблених аніме прямо на сайті.</li>
                <li>Додавати тайтли в обране;</li>
                <li>Вести власний список перегляду;</li>
                <li>Відмічати “дивлюсь”, “переглянуто”, “заплановано” та інші статуси;</li>
                <li>Кастомізувати свій профіль;</li>
            </ul>

            <p className="mb-2">
                І це лише початок! У майбутньому на сайті з’являться нові плеєри, власні tier list’и та ще більше можливостей для фанатів аніме.
            </p>

            <p>
                Ми самі любимо аніме й створюємо AniFlow таким сайтом, яким хотіли б користуватися щодня самі. Саме тому для нас важливі швидка робота, гарний дизайн, зручність і атмосфера, до якої хочеться повертатися.
            </p>
        </div>
    )
}
