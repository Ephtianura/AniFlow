// Зробити "And"-"Or" в жанрах. Приклад: ?genres-is-drama-and-!idols-and-comedy

"use client";

//@ts-ignore
import 'nouislider/dist/nouislider.css';
//@ts-ignore
import '@/styles/nouislider-custom.css';
import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { VscSettings } from "react-icons/vsc";
import noUiSlider, { API as noUiSliderAPI, PipsMode } from "nouislider";
import { apiFetch } from "@/lib/api";
import { AnimeStatusEnum, AnimeStatusMap } from "@/core/enums/AnimeStatus";
import { AnimeRatingEnum, AnimeRatingMap } from "@/core/enums/AnimeRating";
import { AnimeKindEnum, AnimeKindMap } from "@/core/enums/AnimeKind";
import { Genre } from "@/core/types";
import CustomSelect from "../../../components/CustomSelect";
import MultiSelect from "../../../components/MultiSelect";

export enum Filters {
  Genres = "genres",
  Kind = "kind",
  Status = "status",
  Rating = "rating",
  AiredFrom = "airedFrom",
  AiredTo = "airedTo"
}

export default function AnimeFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentYear = new Date().getFullYear();
  const defaultAired: [number, number] = [1970, currentYear];

  const [genres, setGenres] = useState<Genre[]>([]);

  // Init
  const [localGenres, setLocalGenres] = useState<string[]>(() => {
    const fromUrl = searchParams.get(Filters.Genres);
    return fromUrl ? fromUrl.split(",") : [];
  });
  const [localKind, setLocalKind] = useState<AnimeKindEnum | null>(
    () => (searchParams.get(Filters.Kind) as AnimeKindEnum) || null
  );
  const [localStatus, setLocalStatus] = useState<AnimeStatusEnum | null>(
    () => (searchParams.get(Filters.Status) as AnimeStatusEnum) || null
  );
  const [localRating, setLocalRating] = useState<AnimeRatingEnum | null>(
    () => (searchParams.get(Filters.Rating) as AnimeRatingEnum) || null
  );
  const [localAired, setLocalAired] = useState<[number, number]>(() => {
    const from = searchParams.get(Filters.AiredFrom);
    const to = searchParams.get(Filters.AiredTo);
    const startYear = from ? new Date(from).getFullYear() : defaultAired[0];
    const endYear = to ? new Date(to).getFullYear() : defaultAired[1];
    return [startYear, endYear];
  });

  const sliderRef = useRef<HTMLDivElement | null>(null);
  const sliderInstance = useRef<noUiSliderAPI | null>(null);

  //Options
  const kindOptions = [
    { value: null, label: "Оберіть тип" },
    ...Object.entries(AnimeKindMap)
      .filter(([key]) => key !== "Unknown")
      .map(([key, value]) => ({
        value: key as AnimeKindEnum,
        label: value
      }))
  ];
  const statusOptions = [
    { value: null, label: "Оберіть статус" },
    ...Object.entries(AnimeStatusMap)
      .filter(([key]) => key !== "Unknown")
      .map(([key, label]) => ({
        value: key as AnimeStatusEnum,
        label: label as string
      }))
  ];
  const ratingOptions = [
    { value: null, label: "Оберіть рейтинг" },
    ...Object.keys(AnimeRatingEnum)
      .filter(key => isNaN(Number(key)) && key !== "Unknown")
      .map(key => ({
        value: key as AnimeRatingEnum,
        label: `${key} (${AnimeRatingMap[key as keyof typeof AnimeRatingMap]})`
      }))
  ];

  // Genrs
  useEffect(() => {
    apiFetch<Genre[]>("/Genres").then(setGenres);
  }, []);

  // Sync
  useEffect(() => {
    const fromUrl = searchParams.get(Filters.Genres);
    setLocalGenres(fromUrl ? fromUrl.split(",") : []);
    setLocalKind((searchParams.get(Filters.Kind) as AnimeKindEnum) || null);
    setLocalStatus((searchParams.get(Filters.Status) as AnimeStatusEnum) || null);
    setLocalRating((searchParams.get(Filters.Rating) as AnimeRatingEnum) || null);

    const from = searchParams.get(Filters.AiredFrom);
    const to = searchParams.get(Filters.AiredTo);
    const startYear = from ? new Date(from).getFullYear() : defaultAired[0];
    const endYear = to ? new Date(to).getFullYear() : defaultAired[1];
    setLocalAired([startYear, endYear]);

    if (sliderInstance.current) {
      sliderInstance.current.set([startYear, endYear]);
    }
  }, [searchParams]);

  // noUiSlider
  useEffect(() => {
    if (!sliderRef.current) return;

    if (!sliderInstance.current) {
      const totalYears = currentYear - 1970 + 1;
      const maxTicks = 5;

      sliderInstance.current = noUiSlider.create(sliderRef.current, {
        start: localAired,
        connect: true,
        step: 1,
        range: { min: 1970, max: currentYear },
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

      sliderInstance.current.on("slide", (values) => {
        setLocalAired([Number(values[0]), Number(values[1])]);
      });
    }

    return () => {
      if (sliderInstance.current) {
        sliderInstance.current.destroy();
        sliderInstance.current = null;
      }
    };
  }, []);

  const handleApply = () => {
    const params = new URLSearchParams(searchParams.toString());
    const currentParamsString = searchParams.toString();

    params.delete("page");

    if (localGenres.length > 0) {
      params.set(Filters.Genres, localGenres.join(","));
    } else {
      params.delete(Filters.Genres);
    }

    if (localKind) params.set(Filters.Kind, localKind); else params.delete(Filters.Kind);
    if (localStatus) params.set(Filters.Status, localStatus); else params.delete(Filters.Status);
    if (localRating) params.set(Filters.Rating, localRating); else params.delete(Filters.Rating);

    if (localAired[0] !== defaultAired[0] || localAired[1] !== defaultAired[1]) {
      params.set(Filters.AiredFrom, `${localAired[0]}`);
      params.set(Filters.AiredTo, `${localAired[1]}`);
    } else {
      params.delete(Filters.AiredFrom);
      params.delete(Filters.AiredTo);
    }

    const nextParamsString = params.toString();
    const cleanForCompare = (str: string) => {
      const p = new URLSearchParams(str);
      p.delete("page");
      p.sort();
      return p.toString();
    };
    if (cleanForCompare(currentParamsString) === cleanForCompare(nextParamsString)) {
      return;
    }

    router.push(`/animes?${nextParamsString}`);
  };

  const handleClear = () => {
    const params = new URLSearchParams(searchParams.toString());

    const filtersToRemove = [
      Filters.Genres,
      Filters.Kind,
      Filters.Status,
      Filters.Rating,
      Filters.AiredFrom,
      Filters.AiredTo,
      "page",
      "year",
      "season",
      "studio",
      "maxEpisodes",
      "minEpisodes"
    ];

    const hasActiveFilters = filtersToRemove.some(key => searchParams.has(key));
    if (!hasActiveFilters) return;

    filtersToRemove.forEach(key => params.delete(key));
    router.push(`/animes?${params.toString()}`);
  };

  return (
    <div className="bg-white shadow-[0_0_10px_rgba(0,0,0,0.05)] lg:border border-[#DFDFDF] h-full w-full select-none overflow-y-auto xs:overflow-clip">
      <header className="bg-bg-dark text-white w-full ">
        <div
          className="bg-primary flex items-center gap-2 px-4 py-3"
          style={{ clipPath: "polygon(0 0, 60% 0, 50% 100%, 0% 100%)" }}
        >
          <VscSettings className="w-7 h-7" />
          <h2 className="text-xl font-medium">Фільтр</h2>
        </div>
      </header>

      <div className="flex flex-col p-4 space-y-4 w-full h-full">

        {/* Рік */}
        <div className="mb-10">
          <h3 className="font-medium py-2 text-center select-none">Рік виходу</h3>
          <div className="text-sm h-1.5" ref={sliderRef}></div>
        </div>

        {/* Жанри */}
        <div>
          <h3 className="font-medium py-2">Жанри</h3>
          <MultiSelect
            options={genres}
            selectedIds={localGenres}
            onChange={setLocalGenres}
            idKey="slug"
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

        <div className="w-full flex flex-col gap-2">
          <button
            type="button"
            onClick={handleClear}
            className="cursor-pointer text-gray-500 hover:text-gray-800 text-sm transition-colors select-none"
          >
            Очистити фільтр
          </button>

          <button
            type="button"
            onClick={handleApply}
            className="btn-purple px-4 py-2 text-white select-none"
          >
            Шукати
          </button>
        </div>

      </div>
    </div>
  );
}