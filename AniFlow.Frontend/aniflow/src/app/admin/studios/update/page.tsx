import { StudioSearch } from "../../_components/StudioSearch";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Редагування студій | AniFlow"
};

export default function UpdateStudioPage() {
    return (
        <StudioSearch hrefTemplate="/admin/studios/update/:slug"/>
    );
}