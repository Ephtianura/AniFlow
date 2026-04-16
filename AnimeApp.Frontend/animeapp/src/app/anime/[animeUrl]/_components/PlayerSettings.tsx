'use client';
import { useState } from 'react';

// Типы для данных (потом пригодятся для API)
interface Option {
    id: string;
    name: string;
}

interface PlayerSettingsProps {
    voices: Option[];
    players: Option[];
    onVoiceChange: (id: string) => void;
    onPlayerChange: (id: string) => void;
}

export default function PlayerSettings({ voices, players, onVoiceChange, onPlayerChange }: PlayerSettingsProps) {
    const [activeTab, setActiveTab] = useState<'voice' | 'player'>('voice');
    const [selectedVoice, setSelectedVoice] = useState(voices[0]?.id);
    const [selectedPlayer, setSelectedPlayer] = useState(players[0]?.id);

    const currentOptions = activeTab === 'voice' ? voices : players;
    const currentSelected = activeTab === 'voice' ? selectedVoice : selectedPlayer;

    const handleSelect = (id: string) => {
        if (activeTab === 'voice') {
            setSelectedVoice(id);
            onVoiceChange(id);
        } else {
            setSelectedPlayer(id);
            onPlayerChange(id);
        }
    };

    return (
        <div>
            {/* Nav */}
            <div className="flex border-b border-gray-700 w-full mb-4">
                {['voice', 'player'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab as any)}
                        className={`cursor-pointer px-4 py-2 text-xl transition-all duration-200 border-b -mb-px capitalize ${activeTab === tab
                            ? 'border-primary-text text-primary-text'
                            : 'border-transparent text-gray-400 hover:text-white'
                            }`}
                    >
                        {tab === 'voice' ? 'Озвучка' : 'Плеєр'}
                    </button>
                ))}
            </div>

            {/* Список вариантов */}
            <div className="flex flex-col gap-2 text-lg">
                {currentOptions.map((opt) => (
                    <button
                        key={opt.id}
                        onClick={() => handleSelect(opt.id)}
                        className={`text-left px-4 py-2 rounded-lg transition-colors cursor-pointer ${currentSelected === opt.id
                            ? 'bg-[#393a39] text-primary-text'
                            : 'text-gray-300 hover:text-white hover:bg-white/5 active:bg-[#393a39]'
                            }`}
                    >
                        {opt.name}
                    </button>
                ))}
            </div>
        </div>
    );
}