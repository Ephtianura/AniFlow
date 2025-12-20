"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { VscSettings } from "react-icons/vsc";
import { FaSort } from "react-icons/fa";
import noUiSlider, { API as noUiSliderAPI, PipsMode } from "nouislider";
import 'nouislider/dist/nouislider.css';
import '@/styles/nouislider-custom.css';
import { apiFetch } from "@/lib/api";
import { AnimeStatusMap } from "@/core/enums/AnimeStatus";
import { AnimeKindMap } from "@/core/enums/AnimeKind";
import { AnimeRatingEnum, AnimeRatingMap } from "@/core/enums/AnimeRating";


export default function AnimeFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isOpenGenres, setIsOpenGenres] = useState(false);
  const [genres, setGenres] = useState<{ id: number; nameUa: string }[]>([]);

  const [localGenres, setLocalGenres] = useState<number[]>([]);
  const [localKind, setLocalKind] = useState<string | null>(null);
  const [localStatus, setLocalStatus] = useState<string | null>(null);
  const [localRating, setLocalRating] = useState<string | null>(null);
  const [localAired, setLocalAired] = useState<[number, number]>([1990, 2025]);

  const sliderRef = useRef<HTMLDivElement | null>(null);
  const sliderInstance = useRef<noUiSliderAPI | null>(null);
  const currentYear = new Date().getFullYear();



  useEffect(() => {
    apiFetch("/Genres").then(setGenres);
  }, []);

  useEffect(() => {
    if (!sliderRef.current || sliderInstance.current) return;

    const totalYears = currentYear - 1990 + 1;
    const maxTicks = 5; // 

    sliderInstance.current = noUiSlider.create(sliderRef.current!, {
      start: localAired,
      connect: true,
      step: 1,
      range: { min: 1990, max: currentYear },
      tooltips: true,
      format: {
        to: (v) => Math.round(v),
        from: (v) => Number(v),
      },
      pips: {
        mode: PipsMode.Count, 
        values: Math.min(totalYears, maxTicks), 
        density: 4,
        format: {
          to: (v) => String(Math.round(v)),
        },
      },
    });


    sliderInstance.current.on("update", (values) => {
      setLocalAired([Number(values[0]), Number(values[1])]);
    });

    return () => {
      sliderInstance.current?.destroy();
      sliderInstance.current = null;
    };
  }, []);

  const handleApply = () => {
    const params = new URLSearchParams();

    // Жанры (массив)
    localGenres.forEach(g => params.append("GenresId", String(g)));

    if (localKind) params.set("Kind", localKind);
    if (localStatus) params.set("Status", localStatus);
    if (localRating) params.set("Rating", localRating);

    const defaultAired: [number, number] = [1990, currentYear];

    if (localAired[0] !== defaultAired[0] || localAired[1] !== defaultAired[1]) {
      params.set(
        "AiredFrom",
        new Date(localAired[0], 0, 1).toISOString()
      );
      params.set(
        "AiredTo",
        new Date(localAired[1], 11, 31, 23, 59, 59).toISOString()
      );
    }

    router.push(`/animes?${params.toString()}`);
  };

  return (
    <div className="bg-white shadow-[0_0_10px_rgba(0,0,0,0.05)] border border-[#DFDFDF] w-85">
      <header className="bg-bg-dark text-white">
        <div
          className="bg-primary flex items-center gap-2 px-4 py-3"
          style={{ clipPath: "polygon(0 0, 60% 0, 50% 100%, 0% 100%)" }}
        >
          <VscSettings className="w-7 h-7" />
          <h2 className="text-xl font-medium">Фільтр</h2>
        </div>
      </header>

      <div className="flex flex-col p-4 space-y-4">

        {/* Рік */}
        <div className="mb-10 ">
          <h3 className="font-medium py-2 text-center">Рік виходу</h3>
          <div className="text-sm" ref={sliderRef}></div>
        </div>

        {/* Жанри */}
        <div>
          <h3 className="font-medium py-2">Жанри</h3>
          <div className="relative">
            <button
              onClick={() => setIsOpenGenres(!isOpenGenres)}
              className="btn-primary flex items-center justify-between w-full"
            >
              {localGenres.length > 0
                ? genres.filter(g => localGenres.includes(g.id)).map(g => g.nameUa).join(", ")
                : "Оберіть жанри"}
              <FaSort className="w-4 h-4" />
            </button>

            {isOpenGenres && (
              <div className="absolute z-50 w-full max-h-60 overflow-y-auto bg-white border border-btn-border-light mt-1 rounded shadow">
                {genres.map(g => (
                  <label key={g.id} className="flex items-center px-3 py-1 hover:bg-gray-100 cursor-pointer">
                    <input
                      type="checkbox"
                      className="mr-2"
                      checked={localGenres.includes(g.id)}
                      onChange={() =>
                        setLocalGenres(prev =>
                          prev.includes(g.id) ? prev.filter(x => x !== g.id) : [...prev, g.id]
                        )
                      }
                    />
                    {g.nameUa}
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Тип */}
        <div>
          <h3 className="font-medium py-2">Тип</h3>

          <div className="relative">
            <select
              value={localKind || ""}
              onChange={e => setLocalKind(e.target.value || null)}
              className="btn-primary w-full appearance-none"
            >
              <option value="">Оберіть тип</option>
              {Object.entries(AnimeKindMap)
                .filter(([key]) => key !== "Unknown")
                .map(([key, value]) => (
                  <option key={key} value={key}>{value}</option>
                ))
              }
            </select>
            <FaSort className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-text-dark" />
          </div>
        </div>

        {/* Статус */}
        <div>
          <h3 className="font-medium py-2">Статус</h3>
          <div className="relative">
            <select
              value={localStatus || ""}
              onChange={e => setLocalStatus(e.target.value || null)}
              className="btn-primary w-full appearance-none"
            >
              <option value="">Оберіть статус</option>
              {Object.entries(AnimeStatusMap)
                .filter(([key]) => key !== "Unknowntation")
                .map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
            </select>
            <FaSort className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-text-dark" />
          </div>
        </div>

        {/* Рейтинг */}
        <div>
          <h3 className="font-medium py-2">Рейтинг</h3>
          <div className="relative">
            <select
              value={localRating || ""}
              onChange={e => setLocalRating(e.target.value || null)}
              className="btn-primary w-full appearance-none"
            >
              <option value="">Оберіть рейтинг</option>
              {Object.keys(AnimeRatingEnum)
                .filter(key => isNaN(Number(key)) && key !== "Unknown")
                .map(key => (
                  <option key={key} value={key}>
                    {key} ({AnimeRatingMap[key]})
                  </option>
                ))}
            </select>
            <FaSort className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-text-dark" />
          </div>
        </div>


        {/* Кнопка apply */}
        <button
          onClick={handleApply}
          className="mt-4 px-4 py-2 bg-primary text-white rounded-xs shadow-none hover:bg-purple-600 transition cursor-pointer
          border-4 border-white
          active:bg-purple-700
          active:border-4 active:border-purple-300/80"
        >
          Шукати
        </button>
      </div>
    </div>
  );
}
