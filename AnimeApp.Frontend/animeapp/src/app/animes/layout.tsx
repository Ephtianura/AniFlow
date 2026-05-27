import AnimeFiler from '@/app/animes/_components/AnimeFilter';
import { Suspense } from 'react';

export const metadata = {
  title: "Каталог аніме | AniFlow",
  description:
    "Великий каталог аніме: нові серії та популярні тайтли українською мовою. Зручні фільтри та перегляд онлайн безкоштовно на AniFlow.",
};

export default function AnimesLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="lg:grid grid-cols-[1fr_auto] gap-8 items-start">
      {children}


    </main >
  );
}

{/* Фільтр */ }
// <Suspense fallback={<div className="bg-white shadow-[0_0_10px_rgba(0,0,0,0.05)] border border-[#DFDFDF] hidden lg:block w-85 h-[616px] animate-pulse" />}>
//       <AnimeFiler />
//     </Suspense>