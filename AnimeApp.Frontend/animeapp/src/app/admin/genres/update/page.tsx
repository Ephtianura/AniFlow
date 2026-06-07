import { getGenres } from "@/hooks/getGenres";
import UpdateGenresForm from "./UpdateGenresForm";

export const metadata = {
    title: "Редагування жанрів | AniFlow"
};

export default async function UpdateAnimeSearchPage() {
    const genres = await getGenres();
    return (
        <UpdateGenresForm genres={genres} />
    );
};
