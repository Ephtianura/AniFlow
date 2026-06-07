import { getStudio } from "../getStudio";
import UpdateStudio from "./UpdateStudio";

export async function generateMetadata({ params, }: { params: { studioSlug: string }; }) {
    const { studioSlug } = await params;
    const studio = await getStudio(studioSlug);
    return {
        title: `Редагування студії ${studio.name} | AniFlow`,
    };
}

export default async function UpdateStudioPage({ params, }: { params: { studioSlug: string }; }) {
    const { studioSlug } = await params;
    const studio = await getStudio(studioSlug);

    return (
        <UpdateStudio studio = {studio}/>
    );
}