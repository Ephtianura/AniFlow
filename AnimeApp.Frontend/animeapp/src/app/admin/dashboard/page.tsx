"use client";

import { AdminLayout } from "@/components/AdminLayout";
import { useAnimes } from "@/hooks/useAnimes";
import { BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, CartesianGrid, Legend } from "recharts";
import WhiteCard from '@/components/WhiteCard';
import { ResponsiveContainer } from "recharts";
import { AiOutlineNumber } from "react-icons/ai";
import { AnimeKindEnum, AnimeKindMap } from "@/core/enums/AnimeKind";
import { AnimeStatusEnum, AnimeStatusMap } from "@/core/enums/AnimeStatus";
import { AnimeRatingEnum, AnimeRatingMap } from "@/core/enums/AnimeRating";
import { SeasonEnum, SeasonMap } from "@/core/enums/Season";


import { FaCalendarDays } from "react-icons/fa6";
import { FaCloudSun } from "react-icons/fa";
import { FaMasksTheater } from "react-icons/fa6";
import { BiSolidStar } from "react-icons/bi";
import { RiProgress3Fill } from "react-icons/ri";
import { PiFilmSlate } from "react-icons/pi";
import { FaRankingStar } from "react-icons/fa6";
import { LuBuilding2 } from "react-icons/lu";
import { MdVideoLibrary } from "react-icons/md";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28FFF", "#FF6F91"];

export default function AdminDashboard() {
    const { animes, loading } = useAnimes();

    if (loading) return <AdminLayout>Завантаження графіків...</AdminLayout>;

    // ===== Подготовка данных =====
    const byYear = Object.values(
        animes.reduce((acc, a) => {
            acc[a.year] = acc[a.year] || { year: a.year, count: 0 };
            acc[a.year].count += 1;
            return acc;
        }, {} as Record<number, { year: number; count: number }>)
    );

    const seasons: SeasonEnum[] = [SeasonEnum.Winter, SeasonEnum.Spring, SeasonEnum.Summer, SeasonEnum.Fall];

    const bySeason = seasons.map(s => ({
        season: SeasonMap[SeasonEnum[s]],
        count: animes.filter(a => a.season === SeasonEnum[s].toString()).length
    }));



    const genreMap: Record<string, number> = {};
    animes.forEach(a => a.genres.forEach(g => genreMap[g.nameUa] = (genreMap[g.nameUa] || 0) + 1));
    const byGenre = Object.entries(genreMap).map(([name, count]) => ({ name, count }));

    const genreScoreMap: Record<string, { sum: number; count: number }> = {};
    animes.forEach(a => {
        a.genres.forEach(g => {
            genreScoreMap[g.nameUa] = genreScoreMap[g.nameUa] || { sum: 0, count: 0 };
            genreScoreMap[g.nameUa].sum += a.score;
            genreScoreMap[g.nameUa].count += 1;
        });
    });
    const avgScoreByGenre = Object.entries(genreScoreMap).map(([name, { sum, count }]) => ({
        name,
        avgScore: +(sum / count).toFixed(2)
    }));

    const statusMap: Record<string, number> = {};
    animes.forEach(a => statusMap[a.status] = (statusMap[a.status] || 0) + 1);
    const byStatus = Object.entries(statusMap).map(([statusKey, count]) => ({
        key: statusKey,
        name: AnimeStatusMap[statusKey as keyof typeof AnimeStatusMap] ?? statusKey,
        count,
    }));

    const kindMap: Record<string, number> = {};
    animes.forEach(a => kindMap[a.kind] = (kindMap[a.kind] || 0) + 1);

    const byKind = Object.entries(kindMap).map(([kindKey, count]) => ({
        key: kindKey,
        kind: AnimeKindMap[kindKey as keyof typeof AnimeKindMap] ?? kindKey,
        count,
    }));


    const topAnime = [...animes].sort((a, b) => b.score - a.score).slice(0, 10);
    const topAnimePrepared = topAnime.map(a => ({
        ...a,
        ukrainianTitle: a.titles.find(t => t.language === "Ukrainian" && t.type === "Official")?.value ?? "Без назви"
    }));

    const studioMap: Record<string, number> = {};
    animes.forEach(a => studioMap[a.studio.name] = (studioMap[a.studio.name] || 0) + 1);
    const byStudio = Object.entries(studioMap).map(([studio, count]) => ({ studio, count }));

    const episodesBins: Record<string, number> = {};
    animes.forEach(a => {
        const bin = `${Math.floor(a.episodes / 5) * 5}-${Math.floor(a.episodes / 5) * 5 + 4}`;
        episodesBins[bin] = (episodesBins[bin] || 0) + 1;
    });
    const byEpisodes = Object.entries(episodesBins).map(([range, count]) => ({ range, count }));

    return (
        <AdminLayout>
            <h1 className="text-4xl font-extrabold mb-8 text-primary drop-shadow-sm text-center">
                Статистика Аніме
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* 1️⃣ Аніме по роках */}
                <div className="md:col-span-2">

                    <WhiteCard>
                        <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
                            <FaCalendarDays /> Аніме по роках
                        </h2>
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={byYear}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="year" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="count" fill="#814cdcff" />
                            </BarChart>
                        </ResponsiveContainer>
                    </WhiteCard>
                </div>

                {/* 2️⃣ Аніме по сезонах */}
                <WhiteCard>

                    <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
                        <FaCloudSun /> Аніме по сезонах
                    </h2>

                    <ResponsiveContainer width="100%" height={350}>
                        <PieChart>
                            <Pie
                                data={bySeason}
                                dataKey="count"
                                nameKey="season"
                                cx="50%"
                                cy="50%"

                                outerRadius={80}
                                label={{ fontSize: 14 }}
                            >
                                {bySeason.map((_, idx) => (
                                    <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                                ))}
                            </Pie>
                            <Legend verticalAlign="bottom" height={36} />
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>

                </WhiteCard>

                {/* 3️⃣ Аніме по жанрах */}
                <div className="">

                    <WhiteCard>
                        <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
                            <FaMasksTheater />
                            Аніме по жанрах
                        </h2>

                        <ResponsiveContainer width="100%" height={350}>
                            <BarChart
                                data={byGenre}
                                layout="vertical"
                                margin={{ top: 10, right: 20, left: 60, bottom: 10 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />

                                <XAxis type="number" />
                                <YAxis
                                    type="category"
                                    dataKey="name"
                                    width={40}         // нормальная ширина под жанры
                                    tick={{ fontSize: 16 }}
                                />

                                <Tooltip />

                                <Bar dataKey="count" radius={[4, 4, 4, 4]}>
                                    {byGenre.map((_, idx) => (
                                        <Cell
                                            key={idx}
                                            fill={COLORS[idx % COLORS.length]}
                                        />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </WhiteCard>
                </div>

                {/* 4️⃣ Середній рейтинг по жанрах */}
                <WhiteCard>
                    <div className="flex flex-col">
                        <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
                            <FaMasksTheater />
                            <BiSolidStar />  Середній рейтинг по жанрах
                        </h2>

                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={avgScoreByGenre}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis
                                    type="number"
                                    domain={[Math.floor(Math.min(...avgScoreByGenre.map(g => g.avgScore))), 10]}
                                />

                                <Tooltip />
                                <Bar dataKey="avgScore">
                                    {avgScoreByGenre.map((entry, idx) => (
                                        <Cell key={idx} fill={entry.avgScore > 9.4 ? "#4caf50" : "#82ca9d"} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                </WhiteCard>

                {/* 5️⃣ Аніме по статусу */}
                <WhiteCard>
                    <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
                        <RiProgress3Fill /> Аніме по статусу
                    </h2>
                    <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie
                                data={byStatus}
                                dataKey="count"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={80}
                                label
                            >
                                {byStatus.map((_, idx) => <Cell key={idx} fill={COLORS[idx % COLORS.length]} />)}
                            </Pie>
                            <Legend verticalAlign="bottom" height={36} />
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </WhiteCard>

                {/* 6️⃣ Аніме по типу */}
                <WhiteCard>
                    <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
                        <PiFilmSlate /> Аніме по типу
                    </h2>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={byKind}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="kind" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="count" fill="#ffc658" />
                        </BarChart>
                    </ResponsiveContainer>
                </WhiteCard>

                {/* 7️⃣ Топ 10 аніме по рейтингу */}
                <WhiteCard>
                    <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
                        <FaRankingStar /> Топ 10 аніме по рейтингу
                    </h2>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart layout="vertical" data={topAnimePrepared}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis type="number" />
                            <YAxis
                                type="category"
                                dataKey="ukrainianTitle"
                                width={160} // ширина колонки для текста
                                tick={{ dx: -5 }} // сдвиг текста вправо
                                tickFormatter={(value) =>
                                    value.length > 20 ? value.slice(0, 18) + "…" : value //обрез
                                }
                            />
                            <Tooltip />
                            <Bar dataKey="score" fill="#d88484" />
                        </BarChart>
                    </ResponsiveContainer>

                </WhiteCard>

                {/* 8️⃣ Аніме по студіях */}
                <WhiteCard>
                    <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
                        <LuBuilding2 /> Аніме по студіях
                    </h2>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={byStudio}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="studio" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="count" fill="#a4de6c" />
                        </BarChart>
                    </ResponsiveContainer>
                </WhiteCard>

                {/* 9️⃣ Кількість епізодів */}
                <WhiteCard>
                    <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
                        <MdVideoLibrary /> Кількість епізодів
                    </h2>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={byEpisodes}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="range" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="count" fill="#8884d8" />
                        </BarChart>
                    </ResponsiveContainer>
                </WhiteCard>

            </div>
        </AdminLayout>
    );
}
