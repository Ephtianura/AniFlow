
import { AdminAnimeSearch } from "./AdminAnimeSearch";

export const metadata = {
    title: "Редагування аніме | AniFlow"
};

export default function UpdateAnimeSearchPage() {
    return (
        <AdminAnimeSearch hrefTemplate="/admin/anime/update/:slug" />
    );
};
