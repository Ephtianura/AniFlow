"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { VscSettings } from "react-icons/vsc";
import noUiSlider, { API as noUiSliderAPI, PipsMode } from "nouislider";
import { apiFetch } from "@/lib/api";
import { AnimeStatusMap } from "@/core/AnimeStatus";
import { AnimeKindMap } from "@/core/AnimeKind";
import { AnimeRatingEnum, AnimeRatingMap } from "@/core/AnimeRating";
import 'nouislider/dist/nouislider.css';
import '@/styles/nouislider-custom.css';
import CustomSelect from "./CustomSelect";
import MultiSelect from "./MultiSelect";

export default function AnimeFilter() {
  const router = useRouter();
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


  const kindOptions = [
    { value: null, label: "Оберіть тип" }, // Placeholder как опция
    ...Object.entries(AnimeKindMap)
      .filter(([key]) => key !== "Unknown")
      .map(([key, value]) => ({ value: key, label: value }))
  ];
  const statusOptions = [
    { value: null, label: "Оберіть статус" },
    ...Object.entries(AnimeStatusMap)
      .filter(([key]) => key !== "Unknowntation")
      .map(([key, label]) => ({ value: key, label: label as string }))
  ];
  const ratingOptions = [
    { value: null, label: "Оберіть рейтинг" },
    ...Object.keys(AnimeRatingEnum)
      .filter(key => isNaN(Number(key)) && key !== "Unknown")
      .map(key => ({
        value: key,
        label: `${key} (${AnimeRatingMap[key as keyof typeof AnimeRatingMap]})`
      }))
  ];

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
    <div className="bg-white shadow-[0_0_10px_rgba(0,0,0,0.05)] border border-[#DFDFDF] hidden lg:block w-85">
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
          <MultiSelect
            options={genres}
            selectedIds={localGenres}
            onChange={setLocalGenres}
            idKey="id"
            labelKey="nameUa"
            placeholder="Оберіть жанри"
          />
        </div>

        {/* Тип */}
        <div>
          <h3 className="font-medium py-2">Тип</h3>
          <CustomSelect
            value={localKind}
            onChange={setLocalKind}
            options={kindOptions}
            placeholder="Оберіть тип"
          />
        </div>

        {/* Статус */}
        <div>
          <h3 className="font-medium py-2">Статус</h3>
          <CustomSelect
            value={localStatus}
            onChange={setLocalStatus}
            options={statusOptions}
            placeholder="Оберіть статус"
          />
        </div>

        {/* Рейтинг */}
        <div>
          <h3 className="font-medium py-2">Рейтинг</h3>
          <CustomSelect
            value={localRating}
            onChange={setLocalRating}
            options={ratingOptions}
            placeholder="Оберіть рейтинг"
          />
        </div>


        {/* Кнопка apply */}
        <button
          onClick={handleApply}
          className="btn-purple px-4 py-2 text-white  mt-4"
        >
          Шукати
        </button>
      </div>
    </div>
  );
}
