// src/app/store/UserAnimeHydrator.tsx
'use client';

import { useEffect, useRef } from 'react';
import { useUserAnimeStore } from './useUserAnimeStore';
import { UserAnime } from '@/core/types';

type Props = {
  data: UserAnime | null;
};

export function UserAnimeHydrator({ data }: Props) {
  const setOne = useUserAnimeStore((s) => s.setOne);
  
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current && data) {
      useUserAnimeStore.getState().setOne(data.animeId, data);
      initialized.current = true;
    }
  }, [data]);

  return null;
}