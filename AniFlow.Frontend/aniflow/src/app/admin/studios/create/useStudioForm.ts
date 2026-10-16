"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

export const studioFormSchema = z.object({
  name: z.string()
  .regex(/^[a-zA-Z0-9 -]*$/, "Назва може містити лише латинські літери, цифри, дефіси та пробіли")
  .min(1, "Назва обов'язкова"),
  
  slug: z.string()
    .regex(/^[a-z0-9-_]*$/, "Слаг може містити лише малі латинські літери, цифри та дефіси")
    .nullable(),
    
  malId: z.number().positive("ID MyAnimeList має бути позитивним числом").nullable(),
  
  description: z.string().nullable(),
  
  poster: z.object({
    file: z.any().nullable(),
    url: z.string().nullable(),
  }),
});

export type StudioFormValues = z.infer<typeof studioFormSchema>;

export function useStudioForm(initialData?: Partial<StudioFormValues>) {
  const methods = useForm<StudioFormValues>({
    resolver: zodResolver(studioFormSchema),
    defaultValues: initialData || {
      name: "",
      slug: null,
      malId: null,
      description: null,
      poster: {
        file: null,
        url: null,
      },
    },
  });

  return methods;
}