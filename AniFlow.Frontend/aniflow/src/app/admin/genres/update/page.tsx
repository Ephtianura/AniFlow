import { getGenres } from "@/hooks/getGenres";
import UpdateGenresForm from "./UpdateGenresForm";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Редагування жанрів | AniFlow"
};

export default async function UpdateAnimeSearchPage() {
    const genres = await getGenres();
    return (
        <UpdateGenresForm genres={genres} />
    );
};
