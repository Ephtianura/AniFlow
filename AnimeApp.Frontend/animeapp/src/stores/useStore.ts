// import { create } from 'zustand'
// import { UserAnime } from '@/core/types'

// type State = {
//   data: Record<number, UserAnime | null>
//   setOne: (animeId: number, value: UserAnime | null) => void
//   updateOne: (animeId: number, patch: Partial<UserAnime>) => void
// }

// export const useUserAnimeStore = create<State>((set) => ({
//   data: {},

//   setOne: (animeId, value) =>
//     set((state) => ({
//       data: {
//         ...state.data,
//         [animeId]: value
//       }
//     })),

//   updateOne: (animeId, patch) =>
//     set((state) => ({
//       data: {
//         ...state.data,
//         [animeId]: {
//           ...state.data[animeId],
//           ...patch
//         } as UserAnime
//       }
//     }))
// }))