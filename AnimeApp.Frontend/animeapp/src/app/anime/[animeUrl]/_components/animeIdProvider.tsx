'use client';

import { UserAnime } from '@/core/types';
import { createContext, useContext } from 'react';

type AnimeContextType = {
  animeId: number;
  userAnime: UserAnime | null;
};

const AnimeIdContext = createContext<AnimeContextType | null>(null);

export const AnimeIdProvider = ({
  animeId,
  userAnime,
  children,
}: {
  animeId: number;
  userAnime: UserAnime | null;
  children: React.ReactNode;
}) => {
  return (
    <AnimeIdContext.Provider value={{ animeId, userAnime }}>
      {children}
    </AnimeIdContext.Provider>
  );
};

export const useAnimeId = () => {
  const context = useContext(AnimeIdContext);

  if (context === null) {
    throw new Error('useAnimeId must be used inside AnimeIdProvider');
  }

  return context;
};