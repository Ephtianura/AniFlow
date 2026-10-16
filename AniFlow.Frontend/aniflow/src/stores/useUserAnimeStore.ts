import { UserAnime } from "@/core/types";
import { create } from "zustand";

type StoreItem = {
  data: UserAnime | null;
  isDirty: boolean;
};

type UserAnimeStore = {
  data: Record<number, StoreItem>;

  setData: (animeId: number, data: UserAnime | null) => void;
  updateField: (animeId: number, patch: Partial<UserAnime>) => void;
  markClean: (animeId: number) => void;

  clearData: () => void;
};

export const useUserAnimeStore = create<UserAnimeStore>((set) => ({
  data: {},

  setData: (animeId, data) =>
    set((state) => {
      const current = state.data[animeId];

      if (current?.isDirty) return state;

      return {
        data: {
          ...state.data,
          [animeId]: {
            data,
            isDirty: false,
          },
        },
      };
    }),

  updateField: (animeId, patch) =>
    set((state) => {
      const current = state.data[animeId]?.data ?? {
        animeId,
        myList: null,
        rating: null,
        isFavorite: null,
      };

      return {
        data: {
          ...state.data,
          [animeId]: {
            data: {
              ...current,
              ...patch,
            },
            isDirty: true,
          },
        },
      };
    }),

  markClean: (animeId) =>
    set((state) => {
      const current = state.data[animeId];
      if (!current) return state;

      return {
        data: {
          ...state.data,
          [animeId]: {
            ...current,
            isDirty: false,
          },
        },
      };
    }),

  clearData: () => set({ data: {} }),
}));