
import { getGenres } from "@/hooks/getGenres";
import CreateGenresForm from "./CreateGenresForm";

export const metadata = {
    title: "Створення жанрів | AniFlow"
}

export default async function CreateGenrePage() {
    const genres = await getGenres();
    return (
        <CreateGenresForm genres={genres} />
    );
}
