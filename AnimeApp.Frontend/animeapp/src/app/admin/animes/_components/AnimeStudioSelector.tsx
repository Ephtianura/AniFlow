import React from "react";

interface Studio {
    id: number;
    name: string;
}

interface AnimeStudioSelectorProps {
    studios: Studio[];
    selectedStudio: number | null;
    setSelectedStudio: React.Dispatch<React.SetStateAction<number | null>>;
}

export const AnimeStudioSelector: React.FC<AnimeStudioSelectorProps> = ({
    studios,
    selectedStudio,
    setSelectedStudio,
}) => {
    return (
        <div>
            <h2 className="font-bold mb-2">Студія</h2>
            <select
                className="btn-primary"
                value={selectedStudio || ""}
                onChange={(e) => setSelectedStudio(Number(e.target.value))}
            >
                <option value="">Оберіть студію</option>
                {studios.map((s) => (
                    <option key={s.id} value={s.id}>
                        {s.name}
                    </option>
                ))}
            </select>
        </div>
    );
};
