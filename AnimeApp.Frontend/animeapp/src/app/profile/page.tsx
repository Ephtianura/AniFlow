"use client";

import { useUserProfile } from "@/hooks/useUserProfile";
import Link from "next/link";
import StatusBarChart from "./_components/UserAnimeStatusBarChart"
import { notFound } from "next/navigation";
import { ProfileLayout } from "./ProfileLayout";
import ProfileImages from "./ProfileImages";

export default function ProfileHome() {
    const { profile, loading, error, timeFormatted, formattedRegistrationDate } = useUserProfile();

    if (loading) return <ProfileLayout><span></span></ProfileLayout>;
    if (!profile) throw new Error("Profile not found");

    return (
        <ProfileLayout>


            <div className="flex flex-col gap-2">
                
                {/* Вынести */}
                <ProfileImages
                    avatarUrl={profile.avatarUrl}
                    nickname={profile.nickname}
                    formattedRegistrationDate={formattedRegistrationDate}
                />


                {/* Статистика */}
                <div className="flex flex-col text-primary-black">
                    <h1 className="text-3xl font-medium mb-4">Статистика</h1>

                    <div className="flex flex-col gap-4">
                        <h1 className="text-xl font-medium -mb-4">Аніме</h1>

                        {/* Час / бал */}
                        <div className="flex justify-between text-md">
                            <div>
                                <span className="text-gray-dark">Час за переглядом: </span>
                                <span className="text-primary-black">{timeFormatted}</span>
                            </div>
                            <div>
                                <span className="text-gray-dark">Середній бал: </span>
                                <span className="text-primary-black">{profile.averageScore.toFixed(1)}</span>
                            </div>
                        </div>

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

                        <div className="sm:grid grid-cols-2 gap-x-12">

                            {/* Левая колонка */}
                            <div className="flex flex-col gap-1">
                                <ListRow title="Дивлюсь" count={profile.watching} color="bg-blue-100" />
                                <ListRow title="Переглянуто" count={profile.completed} color="bg-green-100" />
                                <ListRow title="Заплановано" count={profile.planned} color="bg-yellow-100" />
                                <ListRow title="Кинуто" count={profile.dropped} color="bg-red-100" />
                                <ListRow title="Передивляюсь" count={profile.rewatching} color="bg-gray-200" />
                            </div>

                            {/* Правая колонка */}
                            <div className="flex flex-col gap-1">
                                <Row title="Всього в списках" value={profile.totalAnime} />
                                <Row title="Епізодів" value={profile.totalEpisodes} />
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </ProfileLayout>
    );
}


function ListRow({ color, title, count }: any) {
    return (
        <div className="flex items-center gap-3">
            <p className={`${color} rounded-full h-4 w-4`}></p>
            <div className="flex items-center justify-between w-full">
                <Link href="" className="text-primary hover:underline">
                    {title}
                </Link>
                <p>{count}</p>
            </div>
        </div>
    );
}

function Row({ title, value }: any) {
    return (
        <div className="flex items-center gap-2">
            <div className="flex items-center justify-between w-full">
                <p className="text-gray-dark">{title}: </p>
                <p className="text-primary-black">{value}</p>
            </div>
        </div>
    );
}
