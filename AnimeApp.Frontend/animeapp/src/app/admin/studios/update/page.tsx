import { StudioSearch } from "../../_components/StudioSearch";

export const metadata = {
    title: "Редагування студій | AniFlow"
};

export default function UpdateStudioPage() {
    return (
        <StudioSearch hrefTemplate="/admin/studios/update/:slug"/>
    );
}