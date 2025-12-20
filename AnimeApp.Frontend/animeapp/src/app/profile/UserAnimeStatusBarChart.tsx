import { useState } from "react";

interface StatusBarChartProps {
    stats: {
        watching: number;
        completed: number;
        planned: number;
        dropped: number;
        rewatching: number;
    };
}

export default function StatusBarChart({ stats }: StatusBarChartProps) {
    const segments = [
        { label: "Дивлюсь", value: stats.watching, color: "bg-blue-100" },
        { label: "Переглянуто", value: stats.completed, color: "bg-green-100" },
        { label: "Заплановано", value: stats.planned, color: "bg-yellow-100" },
        { label: "Кинуто", value: stats.dropped, color: "bg-red-100" },
        { label: "Передивляюсь", value: stats.rewatching, color: "bg-gray-200" },
    ];

    const total = segments.reduce((sum, s) => sum + s.value, 0);
    const displaySegments = total === 0 ? segments.map(s => ({ ...s, value: 1 })) : segments;
    const displayTotal = total === 0 ? segments.length : total;

    const [hovered, setHovered] = useState<number | null>(null);

    return (
        <div className="relative w-full h-6 flex rounded overflow-hidden shadow-[0_0_4px_rgba(0,0,0,0.1)]">
            {displaySegments.map((s, i) => (
                <div
                    key={i}
                    className={`${s.color} relative cursor-pointer`}
                    style={{ width: `${(s.value / displayTotal) * 100}%` }}
                    onMouseEnter={() => setHovered(i)}
                    onMouseLeave={() => setHovered(null)}
                >
                    {hovered === i && (
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10">
                            {s.label}: {s.value}
                        </div>

                    )}
                </div>
            ))}
        </div>
    );
}
