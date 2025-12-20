"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

export interface UserProfile {
  id: number;
  nickname: string;
  avatarUrl: string | null;
  email: string;
  dateOfRegistration: string;
  watching: number;
  completed: number;
  planned: number;
  dropped: number;
  rewatching: number;
  totalAnime: number;
  totalEpisodes: number;
  averageScore: number;
  timeSpent: string;
}

export function useUserProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  const formatTime = (t: string) => {
    const [h, m] = t.split(":").map(Number);
    const days = Math.floor(h / 24);
    const hours = h % 24;
    return `${days} д. ${hours} год. ${m} хв.`;
  };
const formatDate = (iso: string) => {
  const d = new Date(iso);

  return d.toLocaleDateString("uk-UA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

  const loadProfile = async () => {
    setLoading(true);
    try {
      const data: UserProfile = await apiFetch("/user/profile");
      setProfile(data);
      setError(null);
    } catch (e) {
      console.error("Profile load error:", e);
      setError(e);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  return {
    profile,
    loading,
    error,
    reload: loadProfile,
    timeFormatted: profile ? formatTime(profile.timeSpent) : null,
    formattedRegistrationDate: profile ? formatDate(profile.dateOfRegistration) : null,

  };
}
