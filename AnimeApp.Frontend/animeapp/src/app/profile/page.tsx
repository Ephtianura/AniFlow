import Link from "next/link";
import StatusBarChart from "./_components/UserAnimeStatusBarChart"
import ProfileImages from "./_components/ProfileImages";
import { getProfile } from "./_functions/getProfile";
import { formatWatchTime } from "./_functions/formatWatchTime";
import { formatRegisterDate } from "./_functions/formatRegisterDate";
import { MyListEnum } from "@/core/enums/MyList";
import { UserStatsRow } from "./_components/UserStatsRow";
import ShareProfileButton from "./_components/ShareProfileButton";

export const metadata = {
    title: "Профіль | AniFlow",
    description:
        "Переглядайте статистику, списки аніме, улюблені тайтли та активність на AniFlow!",
};

export default async function ProfileHome() {
    const profile = await getProfile();
    const formattedRegistrationDate = formatRegisterDate(profile.dateOfRegistration);
    const watchTime = formatWatchTime(profile.timeSpent);

    return (
        <div className="flex flex-col gap-2 relative">

            <ProfileImages
                avatarUrl={profile.avatarUrl}
                bannerUrl={profile.bannerUrl}
                nickname={profile.nickname}
                formattedRegistrationDate={formattedRegistrationDate}
            />
            <div className="absolute top-2 right-2">
                <ShareProfileButton userId={profile.id} />
            </div>
            {/* Статистика */}
            <div className="flex flex-col text-primary-black">
                <h1 className="text-[1.875rem] font-medium mb-4">Статистика</h1>

                <div className="flex flex-col gap-4">
                    <h1 className="text-xl font-medium -mb-4">Аніме</h1>

                    {/* Час / бал */}
                    <UserStatsRow
                        watchTime={watchTime}
                        averageScore={profile.averageScore}
                    />

                    {/* Графік */}
                    <StatusBarChart
                        stats={{
                            watching: profile.watching,
                            completed: profile.completed,
                            planned: profile.planned,
                            dropped: profile.dropped,
                            rewatching: profile.rewatching,
                        }}
                    />

                    <div className="grid sm:grid-cols-2 gap-x-12">

                        {/* Левая колонка */}
                        <div className="flex flex-col gap-1">
                            <ListRow href={`profile/mylist/${MyListEnum.Watching}`} title="Дивлюсь" count={profile.watching} color="bg-blue-100" />
                            <ListRow href={`profile/mylist/${MyListEnum.Completed}`} title="Переглянуто" count={profile.completed} color="bg-green-100" />
                            <ListRow href={`profile/mylist/${MyListEnum.Planned}`} title="Заплановано" count={profile.planned} color="bg-yellow-100" />
                            <ListRow href={`profile/mylist/${MyListEnum.Dropped}`} title="Кинуто" count={profile.dropped} color="bg-red-100" />
                            <ListRow href={`profile/mylist/${MyListEnum.Rewatching}`} title="Передивляюсь" count={profile.rewatching} color="bg-gray-200" />
                            <ListRow href={"profile/mylist/Favorites"} title="Улюблене" count={profile.favorites} color="bg-purple-200" />
                        </div>

                        {/* Правая колонка */}
                        <div className="flex flex-col gap-1 mt-1 sm:mt-0">
                            <Row title="Всього в списках" value={profile.totalAnime} />
                            <Row title="Епізодів" value={profile.totalEpisodes} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}


type ListRowProps = { href: string, title: string; count: number; color: string; };
function ListRow({ href, title, count, color }: ListRowProps) {
    return (
        <div className="flex items-center gap-3">
            <p className={`${color} rounded-full h-4 w-4`} />
            <div className="flex items-center justify-between w-full">
                <Link href={href} className="text-primary hover:underline">
                    {title}
                </Link>
                <p>{count}</p>
            </div>
        </div>
    );
}
type RowProps = { title: string; value: number; };
function Row({ title, value }: RowProps) {
    return (
        <div className="flex items-center gap-2">
            <div className="flex items-center justify-between w-full">
                <p className="text-gray-dark">{title}: </p>
                <p className="text-primary-black">{value}</p>
            </div>
        </div>
    );
}
