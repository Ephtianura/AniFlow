import { MyListEnum } from "@/core/enums/MyList";
import AnimeTabs from "./_components/AnimeTabs";
import { getUserAnimeList } from "./_functions/getUserAnimeList";
import AnimeList from "./_components/AnimeList";
import { notFound, redirect } from "next/navigation";
import ProfileImages from "../../_components/ProfileImages";
import { getProfile } from "../../_functions/getProfile";
import { formatRegisterDate } from "../../_functions/formatRegisterDate";
import { formatWatchTime } from "../../_functions/formatWatchTime";
import ShareProfileButton from "../../_components/ShareProfileButton";

export const metadata = {
    title: "Список аніме | AniFlow",
    description:
        "",
};

export type MyListParam = MyListEnum | "Favorites";

interface MyListPageProps {
    params: Promise<{
        myList?: MyListParam;
    }>;
}

const allowedMyList = new Set(["Planned", "Watching", "Completed", "Rewatching", "On_hold", "Dropped", "Favorites",] as const);

export default async function MyListPage({ params, }: MyListPageProps) {
    const { myList } = await params;

    const profile = await getProfile();
    const formattedRegistrationDate = formatRegisterDate(profile.dateOfRegistration);

    if (myList && !allowedMyList.has(myList as any))
        redirect("/profile/mylist/Watching");

    const isFavorites = myList === "Favorites";

    const value = myList && myList !== "Favorites"
        ? myList
        : undefined;

    const data = await getUserAnimeList(value, isFavorites);

    const counts = {
        Favorites: data?.favorites ?? 0,
        [MyListEnum.Watching]: data?.watching ?? 0,
        [MyListEnum.Completed]: data?.completed ?? 0,
        [MyListEnum.Planned]: data?.planned ?? 0,
        [MyListEnum.Rewatching]: data?.rewatching ?? 0,
        [MyListEnum.On_hold]: data?.on_hold ?? 0,
        [MyListEnum.Dropped]: data?.dropped ?? 0,
    };

    return (
        <div className="flex flex-col gap-2 relative">
            <ProfileImages
                avatarUrl={profile.avatarUrl}
                bannerUrl={profile.bannerUrl}
                nickname={profile.nickname}
                formattedRegistrationDate={formattedRegistrationDate}
                isOnline={true}
                lastOnline={null}
            />
            <div className="absolute top-2 right-2">
                <ShareProfileButton userId={profile.id} />
            </div>
            <h2 className="text-[1.875rem] font-medium">Список аніме</h2>

            <div className="flex flex-col gap-4">

                <AnimeTabs counts={counts} baseUrl={"/profile/mylist"} />
                {/* Пошук в майбутньому */}

                <AnimeList userAnimeList={data} baseUrl={"/profile/mylist"} isMyProfile={true} />

            </div>
        </div>
    );
}
