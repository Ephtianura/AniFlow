import RecalculateRatingButton from "./RecalculateRatingButton";
import ResetCacheButton from "./ResetCacheButton";
import ThrowButton from "./Debug500";

export default function AdminDashboard() {

    return (
        <div className="flex flex-col gap-4">
            <h1 className="text-4xl font-extrabold mb-8 text-primary drop-shadow-sm text-center">
                Панель управління
            </h1>
            {/* <div>
                Наватнаження на сервер

                Графіки:

                "cpu": 32,
                "ram": 68,
                "requestsPerSecond": 120,
                "responseTimeMs": 85

            </div> */}
            <div className="flex flex-col sm:flex-row gap-2 w-full justify-around ">
                <RecalculateRatingButton />
                <ResetCacheButton />
            </div>

            <div className="mx-auto">
                <ThrowButton />
            </div>
{/* 
            <div>
                Всього аніме
                Всього жанрів
                Всього студій
                Кількість користувачів
                Кількість активних користувачів
            </div>
*/}
        </div>
    );
}
