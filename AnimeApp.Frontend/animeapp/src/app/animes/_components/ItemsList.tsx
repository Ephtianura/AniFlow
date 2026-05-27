// components/ItemsList.tsx
'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import { useEffect } from 'react';

export default function ItemsList({ initialData }: { initialData: any[] }) { //!!!!!!!!
  const { ref, inView } = useInView();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ['items'],
    queryFn: async ({ pageParam = 2 }) => {
      const res = await fetch(`/api/items?page=${pageParam}`);
      return res.json();
    },
    initialPageParam: 1,
    // Передаем серверные данные в кэш React Query
    initialData: {
      pages: [initialData],
      pageParams: [1],
    },
    getNextPageParam: (lastPage, allPages) => {
      // Если вернулся пустой массив — значит, данных больше нет
      return lastPage.length > 0 ? allPages.length + 1 : undefined;
    },
  });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  return (
    <div>
      <div className="grid gap-4">
        {data?.pages.flatMap((page) => page).map((item: any) => (// !!!!
          <div key={item.id} className="p-4 border rounded">
            {item.title}
          </div>
        ))}
      </div>

      <div ref={ref} className="h-10">
        {isFetchingNextPage && <p>Загружаем еще...</p>}
      </div>
    </div>
  );
}