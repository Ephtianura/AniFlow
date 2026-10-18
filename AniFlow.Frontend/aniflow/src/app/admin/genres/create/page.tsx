
import { getGenres } from "@/hooks/getGenres";
import CreateGenresForm from "./CreateGenresForm";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Створення жанрів | AniFlow"
}

export default async function CreateGenrePage() {
    const genres = await getGenres();
    return (
        <CreateGenresForm genres={genres} />
    );
}
