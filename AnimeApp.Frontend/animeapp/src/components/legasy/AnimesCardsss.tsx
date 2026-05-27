
{/* <AnimesCards animes = {animes} viewMode = {viewMode} /> */}

// import AnimeCard from '@/components/AnimeCard';
// import { Animes } from '@/core/types';
// import { ViewMode } from './ViewModeButton';
// import clsx from 'clsx';

// type Props = {
//     animes: Animes[];
//     viewMode: ViewMode;
// }
// export default function AnimesCards({ animes, viewMode }: Props) {

//     return (
//         <div className={clsx(
//             viewMode === "grid" && "grid sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 gap-6",
//             viewMode === "gridLarge" && "grid md:grid-cols-2",
//             viewMode === "list" && "flex flex-col"
//         )}>

//             {animes.map((anime) => (
//                 <AnimeCard
//                     key={anime.id}
//                     id={anime.id}
//                     title={anime.titles.find(t => t.language === "Ukrainian")?.value || anime.titles[0].value}
//                     subTitle={anime.titles.find(t => t.language === "Romaji")?.value}
//                     rating={anime.score}
//                     kind={anime.kind}
//                     year={anime.year}
//                     genres={anime.genres}
//                     description={anime.description}
//                     posterUrl={anime.posterUrl || undefined}
//                     url={anime.url}
//                     viewMode={viewMode}
//                 />
//             ))}
//         </div>
//     );
// }