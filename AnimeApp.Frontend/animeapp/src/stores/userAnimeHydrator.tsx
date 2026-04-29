'use client';

import { useEffect } from 'react';
import { useUserAnimeStore } from './useUserAnimeStore';
import { UserAnime } from '@/core/types';

export function UserAnimeHydrator({ data }: { data: UserAnime | null }) {
  const setData = useUserAnimeStore((s) => s.setData);

  useEffect(() => {
    if (data?.animeId) {
      setData(data.animeId, data);
    }
  }, [data, setData]);

  return null;
}