import CreateStudioForm from "./CreateStudioForm";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Створення студії | AniFlow"
};

export default function CreateStudioPage() {
    return (
        <CreateStudioForm />
    );
}
