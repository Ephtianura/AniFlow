import RecalculateRatingButton from "./RecalculateRatingButton";
import ResetCacheButton from "./ResetCacheButton";
import ThrowButton from "./Debug500";
import DashboardPulse from "./DashboardPulse";
import { apiFetch } from "@/lib/api";
import { DashboardPulseDto, TopAnimeDto } from "@/core/stats";
import SyncControlPanel from "./SyncControlPanel";
import { headers } from "next/headers";
import { Animes, PagedResult } from "@/core/types";

export const metadata = {
    title: "Панель управління | Aniflow"
}
export default async function AdminDashboard() {
    const cookieHeader = (await headers()).get("cookie") ?? "";

    const pulse = await apiFetch<DashboardPulseDto>("/pulse", { cookieHeader })
    const topAnime = await apiFetch<TopAnimeDto[]>("/anime/top", { cookieHeader })
    const pagedNewAnime = await apiFetch<PagedResult<Animes>>("/anime?sortBy=createdAt&pageSize=5")
    return (
        <div className="flex flex-col gap-6">
            <h1 className="text-4xl font-extrabold mb-6 text-primary drop-shadow-sm text-center">
                Панель управління
            </h1>

            <DashboardPulse pulse={pulse} topAnime={topAnime} newAnime={pagedNewAnime.items} />

            <hr className='text-hr-clr' />

            {/* <div>
                Наватнаження на сервер
                "cpu": 32,
                "ram": 68,
            </div> */}

            <SyncControlPanel />

            <hr className='text-hr-clr' />

            <div className="flex flex-col sm:flex-row gap-2 w-full justify-around ">
                <RecalculateRatingButton />
                <ResetCacheButton />
            </div>
            <hr className='text-hr-clr' />
            <div className="mx-auto">
                <ThrowButton />
            </div>

        </div>
    );
}
