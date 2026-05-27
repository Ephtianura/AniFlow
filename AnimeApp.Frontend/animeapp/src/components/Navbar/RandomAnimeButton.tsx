"use client";

import { Anime } from "@/core/types";
import { getKawaiiError, KawaiiErrorType } from "@/hooks/getKawaiiError";
import { apiFetch } from "@/lib/api";
import router from "next/router";
import { toast } from "react-toastify";

export const handleRandomClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
        const data = await apiFetch<Anime>("/anime/random");
        router.push(`/anime/${data.url}`);
    } catch (err: any) {
        toast.error(
            err.messages?.[0]
            ?? getKawaiiError(KawaiiErrorType.Network)
        );
    }
};


