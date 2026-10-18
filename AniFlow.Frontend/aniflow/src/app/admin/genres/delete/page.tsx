import { getGenres } from "@/hooks/getGenres";
import DeleteGenresForm from "./DeleteGenresForm";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Видалення жанрів | AniFlow"
};

export default async function UpdateAnimeSearchPage() {
    const genres = await getGenres();
    return (
        <DeleteGenresForm genres={genres} />
    );
};
