import { Metadata } from "next";
import DeleteAnime from "./DeleteAnime";

export const metadata: Metadata = {
    title: "Видалення аніме | AniFlow",
};

export default function DeleteAnimePage() {
    return (<DeleteAnime />);
}