"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { TagType } from "@/core/enums/TagType";

export const createGenreSchema = z.object({
  nameUa: z.string().min(1, "Назва UA обов'язкова"),
  nameEn: z.string().min(1, "Назва EN обов'язкова")
  .regex(/^[a-zA-Z\s-]+$/, "Англійська назва може містити лише латинські літери пробіл та дефіс"),
  type: z.enum(TagType),
});
export type CreateGenreValues = z.infer<typeof createGenreSchema>;
export function useCreateGenreForm() {
  const methods = useForm<CreateGenreValues>({
    resolver: zodResolver(createGenreSchema),
    defaultValues: {
      nameUa: "",
      nameEn: "",
      type: TagType.Genre,
    },
  });

  return methods;
}

export const updateGenreSchema = z.object({
  nameUa: z.string().min(1, "Назва UA обов'язкова"),
  nameEn: z.string().min(1, "Назва EN обов'язкова")
  .regex(/^[a-zA-Z\s-]+$/, "Англійська назва може містити лише латинські літери пробіл та дефіс"),
  type: z.enum(TagType),
  slug: z.string()
    .min(1, "Слаг обов'язковий")
    .regex(/^[a-z-]+$/, "Слаг може містити лише малі латинські літери та дефіс"),
});
export type UpdateGenreValues = z.infer<typeof updateGenreSchema>;
export function useUpdateGenreForm() {
  const methods = useForm<UpdateGenreValues>({
    resolver: zodResolver(updateGenreSchema),
    defaultValues: {
      nameUa: "",
      nameEn: "",
      type: TagType.Genre,
      slug: "",
    },
  });

  return methods;
}