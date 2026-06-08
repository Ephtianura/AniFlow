'use client';

import { RiSkipLeftLine, RiSkipRightLine } from 'react-icons/ri';
import PlayerEpisodeSelect from './PlayerEpisodeSelect';

interface EpisodeSelectorProps {
    totalEpisodes: number;
    currentEpisode: number;
    onEpisodeChange: (episode: number) => void;
    activeVoice: string;
    activePlayer: string;
    onOpenMobileSettings: () => void;
}

export default function EpisodeSelectorMobile({
    totalEpisodes,
    currentEpisode,
    onEpisodeChange,
    activeVoice,
    activePlayer,
    onOpenMobileSettings
}: EpisodeSelectorProps) {

    const episodeOptions = Array.from({ length: totalEpisodes }, (_, i) => {
        const num = i + 1;
        return {
            value: num,
            label: `${num} серія` 
        };
    });

    return (
        <div className='flex flex-col md:flex-row md:items-center gap-3 w-full'>
            {/* Серії */}
            <div className='order-1 md:order-2 flex items-center gap-2 grow'>
                <button
                    disabled={currentEpisode <= 1}
                    onClick={() => onEpisodeChange(currentEpisode - 1)}
                    className='px-6 py-2 btn-player-mobile group text-[#6C757D] disabled:opacity-20 disabled:cursor-not-allowed'
                >
                    <RiSkipLeftLine className="w-6 h-6 group-active:text-white" />
                </button>
                <PlayerEpisodeSelect<number>
                    value={currentEpisode}
                    onChange={onEpisodeChange}
                    options={episodeOptions}
                />
                <button
                    disabled={currentEpisode >= totalEpisodes}
                    onClick={() => onEpisodeChange(currentEpisode + 1)}
                    className='px-6 py-2 btn-player-mobile group text-[#6C757D] disabled:opacity-20 disabled:cursor-not-allowed'
                >
                    <RiSkipRightLine className="w-6 h-6 group-active:text-white" />
                </button>
            </div>

            {/* Озвучки */}
            <button className='order-2 md:order-1 py-2 px-4 btn-player-mobile group'
                onClick={onOpenMobileSettings}>
                <div className='flex md:gap-4 sm:justify-between'>
                    <span className='text-[#DEE2E6] text-xl mr-auto group-active:text-white line-clamp-1'>
                        {activeVoice ?? `---`}
                    </span>
                    <span className='text-[#6C757D] text-[17.5px] group-active:text-white'>
                        {activePlayer ?? `---`}
                    </span>
                </div>
            </button>
        </div>
    );
}