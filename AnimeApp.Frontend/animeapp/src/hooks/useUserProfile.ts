"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import router from "next/router";

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

  const formatTime = (t: string | null) => {
    if (!t) return "0 д. 0 год. 0 хв.";

    const match = t.match(/(?:(\d+)\.)?(\d+):(\d+):(\d+)/);

    if (!match) return t; 

    const days = parseInt(match[1] || "0");
    const hours = parseInt(match[2]);
    const minutes = parseInt(match[3]);

    return `${days} д. ${hours} год. ${minutes} хв.`;
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
      const data: UserProfile = await apiFetch("/user/me/profile");
      setProfile(data);
      setError(null);
    } catch (e: any) {
      console.error("Profile load error:", e);
      
      // Ловим нашу 401 ошибку
      if (e.status === 401 || e.message === "Unauthorized") {
        window.location.href = "/login";
        return; 
      }

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
