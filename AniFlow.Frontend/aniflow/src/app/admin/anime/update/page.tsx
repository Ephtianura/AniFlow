
import { AdminAnimeSearch } from "./AdminAnimeSearch";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Редагування аніме | AniFlow"
};

export default function UpdateAnimeSearchPage() {
    return (
        <AdminAnimeSearch hrefTemplate="/admin/anime/update/:slug" />
    );
};
