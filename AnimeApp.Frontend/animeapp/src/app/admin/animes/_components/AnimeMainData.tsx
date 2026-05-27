// "use client";

// import React from "react";
// import { AnimeStatusEnum, AnimeStatusMap } from "@/core/enums/AnimeStatus";
// import { AnimeRatingEnum } from "@/core/enums/AnimeRating";
// import { AnimeKindEnum, AnimeKindMap } from "@/core/enums/AnimeKind";

// interface AnimeMainDataProps {
//     airedOn: string;
//     setAiredOn: React.Dispatch<React.SetStateAction<string>>;
//     releasedOn: string;
//     setReleasedOn: React.Dispatch<React.SetStateAction<string>>;
//     kind?: number | null;
//     setKind: React.Dispatch<React.SetStateAction<number>>;
//     status?: number | null;
//     setStatus: React.Dispatch<React.SetStateAction<number>>;
//     rating?: number | null;
//     setRating: React.Dispatch<React.SetStateAction<number>>;
//     score?: number | null;
//     setScore: React.Dispatch<React.SetStateAction<number>>;
//     episodes?: number | null;
//     setEpisodes: React.Dispatch<React.SetStateAction<number>>;
//     episodesAired?: number | null;
//     setEpisodesAired: React.Dispatch<React.SetStateAction<number>>;
//     duration?: number | null;
//     setDuration: React.Dispatch<React.SetStateAction<number>>;
//     description: string;
//     setDescription: React.Dispatch<React.SetStateAction<string>>;
// }

// export const AnimeMainData: React.FC<AnimeMainDataProps> = ({
//     airedOn,
//     setAiredOn,
//     releasedOn,
//     setReleasedOn,
//     kind,
//     setKind,
//     status,
//     setStatus,
//     rating,
//     setRating,
//     score,
//     setScore,
//     episodes,
//     setEpisodes,
//     episodesAired,
//     setEpisodesAired,
//     duration,
//     setDuration,
//     description,
//     setDescription,
// }) => {
//     return (
//         <div className="col-span-2 grid sm:grid-cols-2 md:grid-cols-3 gap-4">
//             <div>
//                 <label>Дата виходу</label>
//                 <input
//                     type="date"
//                     value={airedOn}
//                     onChange={(e) => setAiredOn(e.target.value)}
//                     className="btn-primary"
//                 />
//             </div>
//             <div>
//                 <label>Дата реліза</label>
//                 <input
//                     type="date"
//                     value={releasedOn}
//                     onChange={(e) => setReleasedOn(e.target.value)}
//                     className="btn-primary"
//                 />
//             </div>
//             <div>
//                 <label>Тип</label>
//                 <select
//                     value={kind}
//                     onChange={(e) => setKind(Number(e.target.value))}
//                     className="btn-primary"
//                 >
//                     {Object.keys(AnimeKindEnum)
//                         .filter((k) => isNaN(Number(k)))
//                         .map((k) => (
//                             <option
//                                 key={k}
//                                 value={AnimeKindEnum[k as keyof typeof AnimeKindEnum]}
//                             >
//                                 {AnimeKindMap[k] ?? k}
//                             </option>
//                         ))}
//                 </select>
//             </div>

//             <div>
//                 <label>Статус</label>
//                 <select
//                     value={status}
//                     onChange={(e) => setStatus(Number(e.target.value))}
//                     className="btn-primary"
//                 >
//                     {Object.keys(AnimeStatusEnum)
//                         .filter((k) => isNaN(Number(k)))
//                         .map((k) => (
//                             <option
//                                 key={k}
//                                 value={AnimeStatusEnum[k as keyof typeof AnimeStatusEnum]}
//                             >
//                                 {AnimeStatusMap[k] ?? k}
//                             </option>
//                         ))}
//                 </select>
//             </div>

//             <div>
//                 <label>Rating</label>
//                 <select
//                     value={rating}
//                     onChange={(e) => setRating(Number(e.target.value))}
//                     className="btn-primary"
//                 >
//                     {Object.keys(AnimeRatingEnum)
//                         .filter((k) => isNaN(Number(k)))
//                         .map((k) => (
//                             <option
//                                 key={k}
//                                 value={AnimeRatingEnum[k as keyof typeof AnimeRatingEnum]}
//                             >
//                                 {k ?? k}
//                             </option>
//                         ))}
//                 </select>
//             </div>

//             <div>
//                 <label>Оцінка</label>
//                 <input
//                     type="number"
//                     value={score}
//                     onChange={(e) => setScore(Number(e.target.value))}
//                     className="btn-primary"
//                 />
//             </div>

//             <div>
//                 <label>Епізоди</label>
//                 <input
//                     type="number"
//                     value={episodes}
//                     onChange={(e) => setEpisodes(Number(e.target.value))}
//                     className="btn-primary"
//                 />
//             </div>

//             <div>
//                 <label>Епізодів вийшло</label>
//                 <input
//                     type="number"
//                     value={episodesAired}
//                     onChange={(e) => setEpisodesAired(Number(e.target.value))}
//                     className="btn-primary"
//                 />
//             </div>

//             <div>
//                 <label>Тривалість</label>
//                 <input
//                     type="number"
//                     value={duration}
//                     onChange={(e) => setDuration(Number(e.target.value))}
//                     className="btn-primary"
//                 />
//             </div>

//             <div className="sm:col-span-2 md:col-span-3">
//                 <label>Опис</label>
//                 <textarea
//                     value={description}
//                     onChange={(e) => setDescription(e.target.value)}
//                     className="btn-primary max-h-100 overflow-y-auto"
//                     rows={4}
//                 />
//             </div>
//         </div>
//     );
// };
