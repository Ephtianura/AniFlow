'use client';

import { createContext, useContext } from 'react';

const AnimeIdContext = createContext<number | null>(null);

export const AnimeIdProvider = ({
  animeId,
  children,
}: {
  animeId: number;
  children: React.ReactNode;
}) => {
  return (
    <AnimeIdContext.Provider value={animeId}>
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