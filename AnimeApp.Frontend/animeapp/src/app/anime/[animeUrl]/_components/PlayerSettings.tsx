'use client';

import { useState, useMemo } from 'react';
import { MdOutlineSubtitles } from "react-icons/md";

interface Option {
    id: string;
    name: string;
    isSubtitles?: boolean;
}

interface PlayerSettingsProps {
    voices: Option[];
    players: Option[];
    activeVoiceId: string;
    activePlayerId: string;
    onVoiceChange: (id: string) => void;
    onPlayerChange: (id: string) => void;
}

export default function PlayerSettings({
    voices,
    players,
    activeVoiceId,
    activePlayerId,
    onVoiceChange,
    onPlayerChange
}: PlayerSettingsProps) {

    const [activeTab, setActiveTab] = useState<'voice' | 'player'>('voice');

    const isSubtitlesVoice = (opt: Option) => {
        const name = opt.name.toLowerCase();

        return (
            opt.isSubtitles === true ||
            name.includes('sub') ||
            name.includes('суб') ||
            name.includes('subtitles')
        );
    };

    const currentOptions = activeTab === 'voice' ? voices : players;

    const currentSelected =
        activeTab === 'voice'
            ? activeVoiceId
            : activePlayerId;

    const handleSelect = (id: string) => {
        if (activeTab === 'voice') {
            if (id === activeVoiceId) return;
            onVoiceChange(id);
        } else {
            if (id === activePlayerId) return;
            onPlayerChange(id);
        }
    };

    const renderedOptions = useMemo(() => {
        if (activeTab !== 'voice') return currentOptions;

        return currentOptions.map(opt => ({
            ...opt,
            isSub: isSubtitlesVoice(opt)
        }));
    }, [currentOptions, activeTab]);

    return (
        <div>

            {/* Tabs */}
            <div className="flex border-b border-gray-700 w-full mb-4">
                {['voice', 'player'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab as any)}
                        className={`cursor-pointer px-4 py-2 text-xl transition-all duration-200 border-b -mb-px capitalize ${
                            activeTab === tab
                                ? 'border-primary-text text-primary-text'
                                : 'border-transparent text-gray-400 hover:text-white'
                        }`}
                    >
                        {tab === 'voice' ? 'Озвучка' : 'Плеєр'}
                    </button>
                ))}
            </div>

            {/* List */}
            <div className="flex flex-col gap-2 text-lg">

                {renderedOptions.map((opt) => {
                    const isSub = activeTab === 'voice' && isSubtitlesVoice(opt);

                    return (
                        <button
                            key={opt.id}
                            onClick={() => handleSelect(opt.id)}
                            className={`text-left px-4 py-2 rounded-lg transition-colors cursor-pointer ${
                                currentSelected === opt.id
                                    ? 'bg-[#393a39] text-primary-text'
                                    : 'text-gray-300 hover:text-white hover:bg-white/5 active:bg-[#393a39]'
                            }`}
                        >
                            <div className="flex items-center  justify-between">
                                {opt.name}

                                {activeTab === 'voice' && isSub && (
                                    <MdOutlineSubtitles className="text-[#545555] w-6 h-6" />
                                )}
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}