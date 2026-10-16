import { getGenres } from "@/hooks/getGenres";
import DeleteGenresForm from "./DeleteGenresForm";

export const metadata = {
    title: "Видалення жанрів | AniFlow"
};

export default async function UpdateAnimeSearchPage() {
    const genres = await getGenres();
    return (
        <DeleteGenresForm genres={genres} />
    );
};
