{/* Триггер для загрузки */}
{/* <LoadMore hasNext={hasNext} currentPage={currentPage ?? 1} viewMode={viewMode} apiQuery={apiQuery} /> */}


// "use client";

// import { useEffect, useRef, useState } from "react";
// import AnimesCards from "./AnimesCards";
// import { ViewMode } from "./ViewModeButton";
// import { getAnimes } from "../_functions/getAnimes";
// import { Animes } from "@/core/types";

// type Props = {
//     hasNext: boolean;
//     currentPage?: number;
//     viewMode: ViewMode;
//     apiQuery: string;
// };

// export default function LoadMore({ hasNext: initHasNext, currentPage: initPage, viewMode, apiQuery }: Props) {
//     if (!initHasNext) return null;

//     const ref = useRef<HTMLDivElement | null>(null);
//     const [hasNext, sethasNext] = useState<boolean>(initHasNext ?? false);
//     const [animes, setAnimes] = useState<Animes[]>([]);
    
//     // Храним текущую страницу в ref, чтобы не перезапускать useEffect
//     const pageRef = useRef<number>(initPage ?? 1);

//     // Функция безопасной сборки URL параметров
//     const updatePageParam = (baseQuery: string, nextPage: number): string => {
//         // Если в apiQuery прилетает строка вида "/anime?PageSize=3", разделяем её по знаку "?"
//         const [path, queryString] = baseQuery.split('?');
        
//         // Передаем в URLSearchParams только чистые параметры (без пути /anime)
//         const params = new URLSearchParams(queryString || path); 

//         // Перезаписываем или добавляем страницу
//         params.set('Page', nextPage.toString());

//         // Если в apiQuery был путь (например "/anime"), возвращаем с ним, иначе просто параметры
//         const basePath = baseQuery.includes('?') ? path : '';
//         return `${basePath}?${params.toString()}`;
//     };

//     // Сбрасываем стейт, если изменился глобальный поисковый запрос/фильтр
//     useEffect(() => {
//         sethasNext(initHasNext ?? false);
//         pageRef.current = initPage ?? 1;
//         setAnimes([]);
//     }, [apiQuery, initHasNext, initPage]);

//     useEffect(() => {
//         if (!hasNext) return;

//         const observer = new IntersectionObserver(async ([entry]) => {
//             if (entry.isIntersecting) {
//                 // Берем актуальную страницу из рефа и вычисляем следующую
//                 const nextPage = pageRef.current + 1;
//                 const queryString = updatePageParam(apiQuery, nextPage);

//                 const res = await getAnimes(queryString);

//                 if (!res || !res.items.length || !res.hasNext) {
//                     sethasNext(false);
//                     return;
//                 }

//                 // Успешно загрузили: обновляем ref страницы БЕЗ перезапуска эффекта
//                 pageRef.current = nextPage; 
//                 sethasNext(res.hasNext);
//                 setAnimes(prev => [...prev, ...res.items]);
//             }
//         });

//         const el = ref.current;
//         if (el) observer.observe(el);

//         return () => {
//             if (el) observer.unobserve(el);
//             observer.disconnect();
//         };
//     }, [hasNext, apiQuery]);


//     return (
//         <div>
//             {animes.length > 0 &&
//                 <AnimesCards animes={animes} viewMode={viewMode} />
//             }

//             <div ref={ref} style={{ height: 1 }} />
//         </div>

//     )
// }