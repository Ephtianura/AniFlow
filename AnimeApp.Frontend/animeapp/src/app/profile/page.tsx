"use client";

import { ProfileLayout } from "@/components/ProfileLayout";
import { useUserProfile } from "@/hooks/useUserProfile";
import Link from "next/link";
import StatusBarChart from "./_components/UserAnimeStatusBarChart"
import { notFound } from "next/navigation";

export default function ProfileHome() {
    const { profile, loading, error, timeFormatted, formattedRegistrationDate } = useUserProfile();

    if (loading) return <ProfileLayout><span></span></ProfileLayout>;
    if (!profile) throw new Error("Profile not found");

    return (
        <ProfileLayout>

            <div className="bg-white h-100 -m-4">
                <img src="/NotFound.jpg" alt="" className=" object-cover h-full w-full" />
            </div>
            <div className="flex flex-col gap-2">

{/* Вынести */}
                <div className="flex flex-col items-center lg:flex-row lg:gap-6">

                    {/* Аватар */}
                    <div className="flex flex-col gap-2">
                        <div className="w-50 -mt-20 aspect-square rounded-full ring-4 ring-white shadow-[0_0_15px_rgba(0,0,0,0.3)] overflow-hidden">
                            <img
                                src={profile.avatarUrl ?? "/404.gif"}
                                alt="Аватар"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>

                    {/* Інформація */}
                    <div className="flex flex-col w-full items-center lg:items-start">

                        <div className="flex flex-col gap-2 py-2">
                            <p className="text-4xl font-normal">
                                {profile.nickname}
                            </p>
                            <p className="text-sm font-normal text-gray-text">
                                на сайті з {formattedRegistrationDate}
                            </p>
                        </div>

                        <hr className="text-hr-clr w-full" />

                    </div>
                </div>

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
