"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, CartesianGrid, Legend, ResponsiveContainer } from "recharts";
import WhiteCard from '@/components/WhiteCard';

import { FaCalendarDays, FaCloudSun, FaMasksTheater, FaRankingStar, FaRegHeart } from "react-icons/fa6";
import { BiSolidStar } from "react-icons/bi";
import { RiProgress3Fill } from "react-icons/ri";
import { PiFilmSlate } from "react-icons/pi";
import { LuBuilding2 } from "react-icons/lu";
import { MdVideoLibrary } from "react-icons/md";
import { AiOutlinePieChart } from "react-icons/ai";
import { AdminDashboardStatsDto, UserListsStatsDto } from "@/core/stats";
import { SeasonMap } from "@/core/enums/Season";
import { AnimeStatusMap } from "@/core/enums/AnimeStatus";
import { AnimeKindMap } from "@/core/enums/AnimeKind";
import { useRouter } from "next/navigation";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28FFF", "#FF6F91"];

interface AnimeStatisticProps {
    animeStats: AdminDashboardStatsDto;
    userListStats: UserListsStatsDto;
}

const userListLabels: Record<string, string> = {
    Planned: "У планах",
    Watching: "Дивлюсь",
    Completed: "Переглянуто",
    Rewatching: "Переглядаю",
    On_hold: "Призупинено",
    Dropped: "Покинуто"
};

export default function AnimeStatistic({ animeStats, userListStats }: AnimeStatisticProps) {
    const router = useRouter();

    const minAvgScore = animeStats.avgScoreByGenre?.length
        ? Math.floor(Math.min(...animeStats.avgScoreByGenre.map(g => g.avgScore)))
        : 0;
    const preparedSeasonData = animeStats.bySeason.map(item => ({
        ...item,
        ukName: SeasonMap[item.season] || item.season
    }));
    const preparedStatusData = animeStats.byStatus.map(item => ({
        ...item,
        ukName: AnimeStatusMap[item.status] || item.status
    }));
    const preparedKindData = animeStats.byKind.map(item => ({
        ...item,
        ukName: AnimeKindMap[item.kind] || item.kind
    }));
    const preparedUserListData = userListStats.byListType.map(item => ({
        ...item,
        ukName: userListLabels[item.listType] || item.listType
    }));

    return (
        <div className="select-none">
            <h1 className="text-4xl font-extrabold mb-8 text-primary text-center tracking-tight">
                Статистика Аніме
            </h1>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="p-4 bg-linear-to-br from-indigo-400 to-purple-500 rounded-xl text-white shadow-md">
                    <p className="text-sm opacity-80 font-medium">Всього тайтлів</p>
                    <p className="text-3xl font-black mt-1">{animeStats.totalAnimeCount}</p>
                </div>
                <div className="p-4 bg-linear-to-br from-amber-400 to-orange-500 rounded-xl text-white shadow-md">
                    <p className="text-sm opacity-80 font-medium">Глобальний рейтинг</p>
                    <p className="text-3xl font-black mt-1">★ {animeStats.globalAvgScore}</p>
                </div>
                <div className="p-4 bg-linear-to-br from-emerald-400 to-teal-500 rounded-xl text-white shadow-md">
                    <p className="text-sm opacity-80 font-medium">Студій / Жанрів</p>
                    <p className="text-2xl font-black mt-1">{animeStats.totalStudiosCount} / {animeStats.totalGenresCount}</p>
                </div>
                <div className="p-4 bg-linear-to-br from-rose-400 to-pink-500 rounded-xl text-white shadow-md">
                    <p className="text-sm opacity-80 font-medium">Всього оцінок / В улюбленому</p>
                    <p className="text-2xl font-black mt-1">{userListStats.totalRatedCount} / {userListStats.totalFavoritesCount}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* 1️⃣ Аніме по роках */}
                <div className="md:col-span-2">
                    <WhiteCard>
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-800">
                            <FaCalendarDays className="text-indigo-600" /> Розподіл випусків по роках
                        </h2>
                        <ResponsiveContainer width="100%" height={280}>
                            <BarChart
                                data={animeStats.byYear.filter(item => item.year && item.year > 0)}
                            >
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />

                                <XAxis
                                    dataKey="year"
                                    tick={{ fontSize: 12 }}
                                    interval="preserveStartEnd"
                                />
                                <YAxis />
                                <Tooltip cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }} />
                                <Bar
                                    dataKey="count"
                                    fill="#6366f1"
                                    radius={[4, 4, 0, 0]}
                                    name="Кількість"
                                    onClick={(data: any) => router.push(`/animes?year=${data.year}`)}
                                    className="cursor-pointer"
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </WhiteCard>
                </div>

                {/* 2️⃣ Аніме по сезонах */}
                <WhiteCard>
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-800">
                        <FaCloudSun className="text-amber-500" /> Аніме по сезонах
                    </h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={preparedSeasonData}
                                dataKey="count"
                                nameKey="ukName"
                                cx="50%"
                                cy="50%"
                                outerRadius={90}
                                label
                            >
                                {preparedSeasonData.map((_, idx) => (
                                    <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                                ))}
                            </Pie>
                            <Legend verticalAlign="bottom" height={36} />
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </WhiteCard>

                {/* 🔟 Статистика Списків Користувачів */}
                <WhiteCard>
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-800">
                        <AiOutlinePieChart className="text-teal-500" /> Списки користувачів
                    </h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={preparedUserListData}
                                dataKey="count"
                                nameKey="ukName"
                                cx="50%"
                                cy="50%"
                                innerRadius={50}
                                outerRadius={90}
                                paddingAngle={3}
                                label
                            >
                                {preparedUserListData.map((_, idx) => (
                                    <Cell key={idx} fill={COLORS[idx % COLORS.length]}
                                    />
                                ))}
                            </Pie>
                            <Legend verticalAlign="bottom" height={36} />
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </WhiteCard>

                {/* 3️⃣ Аніме по жанрах */}
                <WhiteCard>
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-800">
                        <FaMasksTheater className="text-purple-600" /> Найпопулярніші жанри (К-сть)
                    </h2>
                    <ResponsiveContainer width="100%" height={350}>
                        <BarChart
                            data={animeStats.byGenre.slice(0, 15)} // Ограничим топ-15 для красоты
                            layout="vertical"
                            margin={{ top: 10, right: 20, left: 20, bottom: 10 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                            <XAxis type="number" />
                            <YAxis
                                type="category"
                                dataKey="name"
                                width={100}
                                tick={{ fontSize: 13 }}
                            />
                            <Tooltip />
                            <Bar dataKey="count" radius={[0, 4, 4, 0]} name="Кількість"
                                onClick={(data: any) => router.push(`/animes?genres=${data.slug}`)} className="cursor-pointer">
                                {animeStats.byGenre.map((_, idx) => (
                                    <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                                ))}

                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </WhiteCard>

                {/* 4️⃣ Середній рейтинг по жанрах */}
                <WhiteCard>
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-800">
                        <BiSolidStar className="text-yellow-500" /> Середній рейтинг по жанрах
                    </h2>
                    <ResponsiveContainer width="100%" height={350}>
                        <BarChart data={animeStats.avgScoreByGenre.slice(0, 15)}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="name" tick={{ fontSize: 11, angle: -25, textAnchor: 'end' }} height={60} />
                            <YAxis type="number" domain={[minAvgScore, 10]} />
                            <Tooltip />
                            <Bar dataKey="avgScore" radius={[4, 4, 0, 0]} name="Середня оцінка"
                                onClick={(data: any) => router.push(`/animes?genres=${data.slug}`)} className="cursor-pointer">
                                {animeStats.avgScoreByGenre.map((entry, idx) => (
                                    <Cell key={idx} fill={entry.avgScore > 7.5 ? "#10b981" : "#3b82f6"} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </WhiteCard>

                {/* 5️⃣ Аніме по статусу */}
                <WhiteCard>
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-800">
                        <RiProgress3Fill className="text-blue-500" /> Статус релізу тайтлів
                    </h2>
                    <ResponsiveContainer width="100%" height={260}>
                        <PieChart>
                            <Pie
                                data={preparedStatusData}
                                dataKey="count"
                                nameKey="ukName"
                                cx="50%"
                                cy="50%"
                                outerRadius={80}
                                label
                            >
                                {preparedStatusData.map((_, idx) => <Cell key={idx} fill={COLORS[idx % COLORS.length]} />)}
                            </Pie>
                            <Legend verticalAlign="bottom" />
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </WhiteCard>

                {/* 6️⃣ Аніме по типу */}
                <WhiteCard>
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-800">
                        <PiFilmSlate className="text-rose-500" /> Розподіл за форматом
                    </h2>
                    <ResponsiveContainer width="100%" height={260}>
                        <BarChart data={preparedKindData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="ukName" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="count" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Кількість" />
                        </BarChart>
                    </ResponsiveContainer>
                </WhiteCard>

                {/* 8️⃣ Аніме по студіях */}
                <WhiteCard>
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-800">
                        <LuBuilding2 className="text-emerald-600" /> Топ-20 студій за кількістю проектів
                    </h2>
                    <ResponsiveContainer width="100%" height={280}>
                        <BarChart data={animeStats.byStudio}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="studio" tick={{ fontSize: 10, angle: -20, textAnchor: 'end' }} height={50} />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} name="Тайтлів" className="cursor-pointer"
                                onClick={(data: any) => router.push(`/animes?studio=${data.slug}`)}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </WhiteCard>

                {/* 9️⃣ Кількість епізодів */}
                <WhiteCard>
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-800">
                        <MdVideoLibrary className="text-cyan-500" /> Кількість серій по діапазонам
                    </h2>
                    <ResponsiveContainer width="100%" height={280}>
                        <BarChart data={animeStats.byEpisodes}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="range" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="count" fill="#06b6d4" radius={[4, 4, 0, 0]} name="Тайтлів" />
                        </BarChart>
                    </ResponsiveContainer>
                </WhiteCard>

                {/* 7️⃣ Топ 10 аниме по рейтингу */}
                <div className="md:col-span-2">
                    <WhiteCard>
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-800">
                            <FaRankingStar className="text-amber-500" /> Золота десятка порталу (Топ за рейтингом)
                        </h2>
                        <ResponsiveContainer width="100%" height={320}>
                            <BarChart
                                layout="vertical"
                                data={animeStats.topAnime}
                            >
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                                <XAxis type="number" domain={[0, 10]} />
                                <YAxis
                                    type="category"
                                    dataKey="ukrainianTitle"
                                    width={180}
                                    tick={{ fontSize: 12 }}
                                    tickFormatter={(value) => value.length > 22 ? value.slice(0, 20) + "…" : value}
                                />
                                <Tooltip />
                                <Bar dataKey="score" fill="#f43f5e" radius={[0, 4, 4, 0]} name="★ Рейтинг"
                                    onClick={(data: any) => router.push(`/anime/${data.url}`)} className="cursor-pointer"
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </WhiteCard>
                </div>

            </div>
        </div>
    );
}