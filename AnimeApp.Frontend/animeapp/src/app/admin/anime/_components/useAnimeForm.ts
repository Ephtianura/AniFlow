import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { AnimeKindEnum } from "@/core/enums/AnimeKind";
import { AnimeStatusEnum } from "@/core/enums/AnimeStatus";
import { AnimeRatingEnum } from "@/core/enums/AnimeRating";
import { TitleLanguage, TitleType } from "@/core/enums/AnimeTitle";
import { AnimeSource } from "@/core/enums/AnimeSource";

export const animeFormSchema = z.object({
  titles: z.array(
    z.object({
      value: z.string().min(1, "Назва обов'язкова"),
      language: z.enum(TitleLanguage),
      type: z.enum(TitleType),
    }),
  ),
  airedOn: z.string().nullable(),
  releasedOn: z.string().nullable(),
  kind: z.enum(AnimeKindEnum).nullable(),
  status: z.enum(AnimeStatusEnum).nullable(),
  rating: z.enum(AnimeRatingEnum).nullable(),
  source: z.enum(AnimeSource).nullable(),
  nsfw: z.boolean(),
  score: z.number().min(0).max(10),
  episodes: z.number().min(0).nullable(),
  episodesAired: z.number().min(0).nullable(),
  duration: z.number().min(0).nullable(),
  description: z.string().nullable(),
  studiosId: z.number().nullable(),
  genresIds: z.array(z.number()),

  poster: z.object({
    file: z.any().nullable(), // Для объектов File
    url: z.string().nullable(), // Для строк-ссылок
  }),
  screenshots: z.array(z.string()).nullable(),

  // Url, MoonSlug, Ids:Moon Kodik AiList 
});

export type AnimeFormValues = z.infer<typeof animeFormSchema>;

export function useAnimeForm(initialData?: Partial<AnimeFormValues>) {
  const methods = useForm<AnimeFormValues>({
    resolver: zodResolver(animeFormSchema),
    defaultValues: initialData || {
      titles: [
        { value: "", language: TitleLanguage.Romaji, type: TitleType.Official },
      ],
      airedOn: null,
      releasedOn: null,
      kind: null,
      status: null,
      rating: null,
      source: null,
      nsfw: false,
      score: 0,
      episodes: null,
      episodesAired: null,
      duration: null,
      description: null,
      studiosId: null,
      genresIds: [],
      poster: {
        file: null,
        url: null,
      },
      screenshots: null,
    },
  });

  return methods;
}
