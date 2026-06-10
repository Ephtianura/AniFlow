"use client"

import { useRouter } from 'next/navigation';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import {
  FaUsers as Users,
  FaTv as Tv,
  FaChartLine as Activity,
  FaEye as Eye,
  FaComputerMouse as MousePointerClick,
  FaUserPlus as UserPlus,
  FaFire as Flame,
  FaArrowUpRightFromSquare as ArrowUpRight,
  FaRankingStar

} from 'react-icons/fa6';
import { DashboardPulseDto, StatBlockDto, TopAnimeDto } from '@/core/stats';
import { useSignalR } from '@/components/SignalRContext';
import Link from 'next/link';
import { Animes } from '@/core/types';
import { getTitle } from '@/app/anime/[animeUrl]/_functions/getTitle';
import { TitleLanguage, TitleType } from '@/core/enums/AnimeTitle';

interface DashboardPulseProps {
  pulse: DashboardPulseDto;
  topAnime: TopAnimeDto[];
  newAnime: Animes[];
}

export default function DashboardPulse({ pulse, topAnime, newAnime }: DashboardPulseProps) {
  const router = useRouter();
  const { onlineCount, usersCount, guestsCount } = useSignalR()

  const currentOnline = onlineCount > 0 ? onlineCount : pulse.activeUsersNow

  const CounterCard = ({ title, value, icon: Icon, subtext }: any) => (
    <div className="p-5 bg-white border border-gray-200/80 rounded-xl shadow-xs transition-all hover:shadow-md">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{title}</p>
          <p className="text-3xl font-black mt-1 text-gray-800">{value}</p>
        </div>
        <div className="hidden sm:flex p-3 bg-gray-50 border border-gray-100 rounded-lg text-primary">
          <Icon size={20} />
        </div>
      </div>
      {subtext && <p className="text-xs text-gray-400/90 font-medium mt-2">{subtext}</p>}
    </div>
  );

  const MetricChartCard = ({ id, block, icon: Icon, color }: { block: StatBlockDto, icon: any, color: string, id: string }) => {
    const MetricIcon = Icon;

    return (
      <div className="p-5 bg-white border border-gray-200/80 rounded-xl shadow-xs">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 text-gray-500">
              <MetricIcon size={15} className="text-primary" />
              <h3 className="text-sm font-bold text-gray-700">{block.label}</h3>
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-black text-gray-800">{block.countToday}</span>
              <span className="text-xs text-gray-400 font-medium">сьогодні</span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-sm font-extrabold text-gray-600">{block.countWeek}</span>
            <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">за тиждень</p>
          </div>
        </div>

        <div className="w-full min-h-0">
          <ResponsiveContainer width="100%" height={160}>
            {/* Передаем id самому графику, чтобы Recharts не путал инстансы */}
            <AreaChart id={`chart-${id}`} data={block.chartData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
              <defs>
                {/* Используем переданный латинский id без пробелов */}
                <linearGradient id={`grad-${id}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.15} />
                  <stop offset="95%" stopColor={color} stopOpacity={0.01} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#94a3b8' }} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)',
                  color: '#1e293b',
                  fontSize: '12px'
                }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke={color}
                strokeWidth={2.5}
                fillOpacity={1}
                fill={`url(#grad-${id})`}
                name="Кількість"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };
  return (
    <div className="select-none flex flex-col gap-6">

      {/* Шапка дашборда */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-primary tracking-tight flex items-center gap-2">
            <Activity className="animate-pulse w-6 h-6" />
            Пульс
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Моніторинг активності та навантаження платформи в реальному часі
          </p>
        </div>

        <div className="flex items-center gap-2.5 px-4 py-2 bg-emerald-50 border border-emerald-300 rounded-lg shadow-2xs">
          <div className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
          <span className="text-xs font-bold text-emerald-700 font-mono">
            {pulse.currentRps} req / sec
          </span>
        </div>
      </div>

      <hr className='text-hr-clr' />

      {/* 1. Блок глобальных счетчиков */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        <CounterCard
          title="Онлайн зараз"
          value={`${currentOnline}`}
          icon={Users}
          subtext={`
            Гості: ${guestsCount > 0 ? guestsCount : "-"} | 
            Користувачі: ${usersCount > 0 ? usersCount : "-"} | 
            Пік сьогодні: ${pulse.peakOnlineToday}`}
        />
        <CounterCard
          title="Середній онлайн"
          value={pulse.avgOnlineToday}
          icon={Activity}
          subtext="Значення за добу"
        />
        <CounterCard
          title="Користувачі"
          value={pulse.totalUsers}
          icon={UserPlus}
        />
        <CounterCard
          title="База аніме"
          value={pulse.totalAnime}
          icon={Tv}
        />
      </div>

      <hr className='text-hr-clr' />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <MetricChartCard id="visits" block={pulse.visits} icon={MousePointerClick} color="#3b82f6" />
        <MetricChartCard id="playerViews" block={pulse.playerViews} icon={Eye} color="#10b981" />
        <MetricChartCard id="registrations" block={pulse.registrations} icon={UserPlus} color="#6366f1" />
        <MetricChartCard id="userInteractions" block={pulse.userInteractions} icon={Flame} color="#f59e0b" />
      </div>

      <hr className='text-hr-clr' />

      <div className="bg-white border border-gray-200/80 rounded-xl p-5 shadow-xs">
        <div className="mb-4">
          <h3 className="font-bold text-gray-800 uppercase tracking-wide">Нещодавно додані тайтли</h3>
          <p className="text-xs text-gray-400 mt-0.5">Останні релізи, які пройшли через систему імпорту</p>
        </div>

        <div className="divide-y divide-gray-100 border-t border-gray-100">
          {newAnime.map((anime, index) => (
            <Link
              key={index}
              href={`/anime/${anime.url}`}
              target='_blank'
              className="flex flex-col sm:flex-row gap-2 w-full sm:items-center justify-between py-3.5 cursor-pointer group hover:bg-slate-50/80 px-3 rounded-lg transition-all"
            >
              <div className='flex gap-2 items-center'>
                <img
                  src={anime.posterUrl || "/NotFoundPurple.webp"}
                  alt="poster"
                  className='w-15 acpect-5/7 object-cover shrink-0 rounded-lg'
                />
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-semibold text-gray-700 group-hover:text-primary transition-colors line-clamp-2">
                    {getTitle(anime.titles, TitleLanguage.Ukrainian, TitleType.Official) ??
                      getTitle(anime.titles, TitleLanguage.Romaji, TitleType.Official)}
                  </span>
                  <span className="hidden sm:flex text-[11px] text-gray-400 font-medium mt-0.5">
                    Slug: {anime.url}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 ">
                <span className="text-xs text-center mx-auto text-gray-400 font-mono bg-gray-50 px-2 py-1 rounded border border-gray-200/60">
                  {new Date(anime.createdAt).toLocaleString('uk-UA', {
                    day: '2-digit',
                    month: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                  }).replace(',', '')}
                </span>
                <ArrowUpRight size={13} className="text-gray-300 group-hover:text-primary transition-colors shrink-0" />
              </div>
            </Link>
          ))}
          {pulse.recentAnime.length === 0 && (
            <p className="text-sm text-gray-400 py-4 text-center">Сьогодні тайтли ще не додавалися</p>
          )}
        </div>
      </div>

      <hr className='text-hr-clr' />

      {/* 2. Блок ТОП аніме за переглядами */}
      <div className="bg-white border border-gray-200/80 rounded-xl p-5 shadow-xs">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-gray-800 uppercase tracking-wide flex items-center gap-2">
              <FaRankingStar className="text-primary" size={16} />
              Топ аніме за переглядами
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">Найпопулярніші тайтли на основі переглядів</p>
          </div>
        </div>

        <div className="w-full min-h-0">
          {topAnime && topAnime.length > 0 ? (
            <ResponsiveContainer width="100%" height={topAnime.length * 45 + 30}>
              <BarChart
                data={topAnime}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <YAxis
                  dataKey="title"
                  type="category"
                  tick={{ fontSize: 11, fill: '#475569', fontWeight: 600 }}
                  tickLine={false}
                  axisLine={false}
                  width={150}
                />
                <XAxis
                  type="number"
                  tick={{ fontSize: 10, fill: '#94a3b8' }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)',
                    color: '#1e293b',
                    fontSize: '12px'
                  }}
                  formatter={(value: any) => [value, 'Перегляди']}
                />
                <Bar
                  dataKey="totalViews"
                  radius={[0, 6, 6, 0]}
                  barSize={18}
                  className="cursor-pointer"
                  onClick={(data: any) => {
                    if (data?.slug) router.push(`/anime/${data.slug}`);
                  }}
                >
                  {topAnime.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={index === 0 ? '#f59e0b' : '#3b82f6'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-gray-400 py-6 text-center">Дані про популярність ще збираються</p>
          )}
        </div>
      </div>

    </div>
  );
}