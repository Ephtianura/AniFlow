import DeleteStudio from "./DeleteStudio"
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Видалення студій | AniFlow'
}

export default function DeleteStudioPage() {
    return (
        <DeleteStudio />
    );
}
