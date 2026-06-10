import { MyListEnum } from "@/core/enums/MyList";
import { redirect } from "next/navigation";

export default async function Page({ params, }: { params: { id: string }; }) {
    const { id } = await params;
    redirect(`/user/${id}/${MyListEnum.Watching}`);
}