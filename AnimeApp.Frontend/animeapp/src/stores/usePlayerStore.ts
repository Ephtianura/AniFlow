import { create } from "zustand";
import { AnimeOstResponse, AnimeVideoResponse } from "@/core/types";
import { VideoKindLabel } from "@/core/enums/VideoKind";
import { fetchYoutubeMeta } from "@/hooks/fetchYoutubeMeta";

export interface PlaybackItem {
  id: string; // Уникальный ID типа "ost-X-vid-Y" или "promo-Z"
  url: string;
  title: string;
  author: string;
  typeLabel: string;
  isOst: boolean;
  originalVideo: AnimeVideoResponse;
  originalOst?: AnimeOstResponse;
}

interface PlayerState {
  // Аніме
  animeTitle: string;
  animePoster: string;
  osts: AnimeOstResponse[];
  promos: AnimeVideoResponse[];

  // Плеєр
  currentTrack: PlaybackItem | null;
  playlist: PlaybackItem[];
  isPlaying: boolean;
  isMini: boolean;
  isOpen: boolean;
  autoplay: boolean;
  isLoop: boolean;
  volume: number;
  progress: { played: number; playedSeconds: number; loaded: number };
  duration: number;
  playerRef: any | null;

  setPlayerRef: (ref: any) => void;

  openPlayer: (params: {
    animeTitle: string;
    animePoster: string;
    osts: AnimeOstResponse[];
    promos: AnimeVideoResponse[];
    trackId: string;
  }) => void;

  selectTrack: (trackId: string) => void;
  setIsPlaying: (playing: boolean) => void;
  setIsMini: (mini: boolean) => void;
  setIsOpen: (open: boolean) => void;
  setVolume: (vol: number) => void;
  setAutoplay: (val: boolean) => void;
  setIsLoop: (val: boolean) => void;
  setProgress: (progress: any) => void;
  setDuration: (duration: number) => void;
  updateMetadata: (title: string, author: string) => void;
  nextTrack: () => void;
  endTrack: () => void;
  prevTrack: () => void;
  closePlayer: () => void;
}

// Генерація плейліста
const generatePlaylist = (
  osts: AnimeOstResponse[],
  promos: AnimeVideoResponse[],
): PlaybackItem[] => {
  const list: PlaybackItem[] = [];

  osts.forEach((ost) => {
    ost.videos.forEach((vid) => {
      list.push({
        id: `ost-${ost.id}-vid-${vid.id}`,
        url: vid.url,
        title: ost.title,
        author: ost.author || "",
        typeLabel: ost.type,
        isOst: true,
        originalVideo: vid,
        originalOst: ost,
      });
    });
  });

  promos.forEach((promo) => {
    list.push({
      id: `promo-${promo.id}`,
      url: promo.url,
      title: "Завантаження...",
      author: "YouTube",
      typeLabel: VideoKindLabel[promo.kind],
      isOst: false,
      originalVideo: promo,
    });
  });

  return list;
};

// Оновити інформацію для промо
const checkAndFetchCurrentTrackMeta = async (set: any, get: any) => {
  const current = get().currentTrack;
  if (!current || current.isOst || current.title !== "Завантаження...") return;
  const meta = await fetchYoutubeMeta(current.url);
  const updatedTrack = { ...current, title: meta.title, author: meta.author };
  const updatedPlaylist = get().playlist.map((item: PlaybackItem) =>
    item.id === current.id ? updatedTrack : item,
  );
  set({
    currentTrack: updatedTrack,
    playlist: updatedPlaylist,
  });
};

// Ініціалізація Zustand
export const usePlayerStore = create<PlayerState>((set, get) => ({
  animeTitle: "",
  animePoster: "",
  osts: [],
  promos: [],
  currentTrack: null,
  playlist: [],
  isPlaying: false,
  isMini: false,
  isOpen: false,
  autoplay: false,
  isLoop: false,
  volume: 0.4,
  progress: { played: 0, playedSeconds: 0, loaded: 0 },
  duration: 0,
  playerRef: null,

  setPlayerRef: (ref) => set({ playerRef: ref }),

  // Відкрити плеєр
  openPlayer: ({ animeTitle, animePoster, osts, promos, trackId }) => {
    const fullPlaylist = generatePlaylist(osts, promos);
    const targetTrack =
      fullPlaylist.find((t) => t.id === trackId) || fullPlaylist[0];

    set({
      animeTitle,
      animePoster,
      osts,
      promos,
      playlist: fullPlaylist,
      currentTrack: targetTrack,
      isPlaying: true,
      isOpen: true,
      isMini: false,
      progress: { played: 0, playedSeconds: 0, loaded: 0 },
    });
    checkAndFetchCurrentTrackMeta(set, get);
  },

  // Вибрати трек
  selectTrack: (trackId) => {
    const targetTrack = get().playlist.find((t) => t.id === trackId);
    if (targetTrack) {
      set({
        currentTrack: targetTrack,
        isPlaying: true,
        progress: { played: 0, playedSeconds: 0, loaded: 0 },
      });
    }
    checkAndFetchCurrentTrackMeta(set, get);
  },

  setIsPlaying: (playing) => set({ isPlaying: playing }),
  setIsOpen: (open) => set({ isOpen: open }),
  setIsMini: (mini) => set({ isMini: mini }),
  setVolume: (vol) => set({ volume: vol }),
  setAutoplay: (val) => set({ autoplay: val }),
  setIsLoop: (val) => set({ isLoop: val }),
  setProgress: (progress) => set({ progress }),
  setDuration: (duration) => set({ duration }),

  // Оновити дані треку
  updateMetadata: (title, author) => {
    const current = get().currentTrack;
    if (current && !current.isOst && current.title === "Завантаження...") {
      set({ currentTrack: { ...current, title, author } });
    }
  },

  //Наступний трек
  nextTrack: () => {
    const { playlist, currentTrack } = get();
    if (!currentTrack || playlist.length === 0) return;

    const currentIndex = playlist.findIndex((t) => t.id === currentTrack.id);
    if (currentIndex !== -1 && currentIndex < playlist.length - 1) {
      set({ currentTrack: playlist[currentIndex + 1] });
    } else {
      set({ currentTrack: playlist[0] });
    }
    checkAndFetchCurrentTrackMeta(set, get);
  },

  // Минулий трек
  prevTrack: () => {
    const { playlist, currentTrack } = get();
    if (!currentTrack || playlist.length === 0) return;

    const currentIndex = playlist.findIndex((t) => t.id === currentTrack.id);
    if (currentIndex > 0) {
      set({ currentTrack: playlist[currentIndex - 1] });
    }
    checkAndFetchCurrentTrackMeta(set, get);
  },

  // Трек закінчився
  endTrack: () => {
    const { playlist, currentTrack, isLoop, autoplay, playerRef, nextTrack } =
      get();
    if (!currentTrack || playlist.length === 0) return;

    if (isLoop) {
      if (playerRef) playerRef.currentTime = 0;
      playerRef.play();
      return;
    }
    if (autoplay) {
      nextTrack();
      playerRef.play();
    } else {
      set({ isPlaying: false });
    }
  },

  // Повністю закрити плеєр
  closePlayer: () =>
    set({
      currentTrack: null,
      playlist: [],
      osts: [],
      promos: [],
      isPlaying: false,
      isMini: false,
      isOpen: false,
    }),
}));
