'use client';

import { useEffect } from 'react';
import { useUserAnimeStore } from './useUserAnimeStore';
import { UserAnime } from '@/core/types';
// useLayoutEffect?!!?

// Функция, которая кладёт данные ответа с серврера в браузер клиента
export function UserAnimeHydrator({ data }: { data: UserAnime | null }) {
  const setData = useUserAnimeStore(s => s.setData);

  // Как только компонент монтируется на новой странице
  // он записывает новые данные (или null), стирая старые.
  useEffect(() => {
    setData(data);
  }, [data, setData]);

  return null;
}