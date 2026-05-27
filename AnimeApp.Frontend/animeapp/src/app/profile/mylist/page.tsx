import { MyListEnum } from "@/core/enums/MyList";
import { redirect } from "next/navigation";

export default function Page() {
    redirect(`/profile/mylist/${MyListEnum.Watching}`);
}