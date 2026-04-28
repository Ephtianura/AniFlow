import { UserAnime } from "@/core/types";
import { create } from "zustand";

type UserAnimeState = {
  data: UserAnime | null; 
  setData: (data: UserAnime | null) => void;
  updateField: (patch: Partial<UserAnime>) => void;
  clearData: () => void;
}
export const useUserAnimeStore = create<UserAnimeState>((set) => ({
  data: null,
  setData: (data) => set({ data }),
  updateField: (patch) => set((state) => ({
    data: state.data ? { ...state.data, ...patch } : null
  })),
  clearData: () => set({ data: null })
}));