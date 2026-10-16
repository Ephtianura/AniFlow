
import CreateAnimeForms from "./CreateAnimeForms";
import { getGenres } from "@/hooks/getGenres";

export const metadata = {
    title: "Створення аніме | AniFlow"
};

export default async function CreateAnimePage() {
    const genres = await getGenres();
    return (
        <CreateAnimeForms genres={genres} />
    );
}
