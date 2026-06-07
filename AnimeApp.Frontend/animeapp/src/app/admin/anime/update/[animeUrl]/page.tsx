import { getAnime } from "@/app/anime/[animeUrl]/_functions/getAnime";
import pullUkrTitle from "@/app/anime/[animeUrl]/_functions/pullUkrTitle";
import { apiFetch } from "@/lib/api";
import { Genre, Studio } from "@/core/types";
import UpdateAnimeForms from "./UpdateAnimeForms";
import { getGenres } from "@/hooks/getGenres";

export async function generateMetadata({ params, }: { params: { animeUrl: string }; }) {
    const { animeUrl } = await params;
    const anime = await getAnime(animeUrl);
    const title = pullUkrTitle(anime.titles);
    return {
        title: `Редагування аніме ${title} | AniFlow`,
    };
}

export default async function UpdateAnimePage({ params, }: { params: { animeUrl: string }; }) {
    const { animeUrl } = await params;

    const anime = await getAnime(animeUrl)

    let studio: Studio | null = null;
    if (anime.studio != null) {
        try {
            studio = await apiFetch<Studio>(`/studios/${anime.studio.id}`) ?? null;
        } catch (err) {
            console.error(err);
        }
    }

    const genres = await getGenres();

    return (
        <UpdateAnimeForms genres={genres} studio={studio} anime={anime} />
    );
};
