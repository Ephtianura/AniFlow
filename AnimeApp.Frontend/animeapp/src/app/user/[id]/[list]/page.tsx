import WhiteCard from "@/components/WhiteCard";
import { MyListEnum } from "@/core/enums/MyList";
import { getUserPage } from "./getUserPage";
import AnimeTabs from "@/app/profile/mylist/[myList]/_components/AnimeTabs";
import AnimeList from "@/app/profile/mylist/[myList]/_components/AnimeList";
import ProfileImages from "@/app/profile/_components/ProfileImages";
import { formatRegisterDate } from "@/app/profile/_functions/formatRegisterDate";
import { getUserAnimeListByUserId } from "./getUserAnimeListByUserId";
import { MyListParam } from "@/app/profile/mylist/[myList]/page";
import { UserStatsRow } from "@/app/profile/_components/UserStatsRow";
import { formatWatchTime } from "@/app/profile/_functions/formatWatchTime";

interface Props {
    params: Promise<{
        id: string;
        list: MyListParam;
    }>;
}

export async function generateMetadata({ params }: Props) {
    const { id } = await params;
    const user = await getUserPage(id)
    return {
        title: `${user.nickname} | AniFlow`
    };
}

export default async function UserPage({ params }: Props) {
    const { id, list } = await params;

    const isFavorites = list === "Favorites";

    const value =
        list !== "Favorites"
            ? list
            : undefined;


    const userPromise = getUserPage(id)
    const userListPromise = getUserAnimeListByUserId(id, value, isFavorites);

    const [user, userList] = await Promise.all([
        userPromise,
        userListPromise,
    ]);

    const formattedRegistrationDate = formatRegisterDate(user.dateOfRegistration);
    const watchTime = formatWatchTime(user.timeSpent);


    const counts = {
        Favorites: userList?.favorites ?? 0,
        [MyListEnum.Watching]: userList?.watching ?? 0,
        [MyListEnum.Completed]: userList?.completed ?? 0,
        [MyListEnum.Planned]: userList?.planned ?? 0,
        [MyListEnum.Rewatching]: userList?.rewatching ?? 0,
        [MyListEnum.On_hold]: userList?.on_hold ?? 0,
        [MyListEnum.Dropped]: userList?.dropped ?? 0,
    };

    return (
        <div className="flex flex-col gap-4 max-w-301">
            <WhiteCard>
                <div className="flex flex-col gap-2 relative">
                    <ProfileImages
                        userId={user.id}
                        avatarUrl={user.avatarUrl}
                        bannerUrl={user.bannerUrl}
                        nickname={user.nickname}
                        formattedRegistrationDate={formattedRegistrationDate}
                        isOnline={user.isOnline}
                        lastOnline={user.lastOnline}
                        user={user}
                        showShareButton={true}
                    />


                    <h1 className="text-xl font-medium -mb-2">Аніме</h1>
                    <UserStatsRow
                        watchTime={watchTime}
                        averageScore={user.averageScore}
                    />
                </div>

            </WhiteCard>

            <WhiteCard>
                <div className="flex flex-col gap-4">
                    <AnimeTabs counts={counts} baseUrl={`/user/${id}`} />
                    <AnimeList userAnimeList={userList} baseUrl={`/user/${id}`} isMyProfile={false} />
                </div>
            </WhiteCard>


        </div>
    );
}

// type Props = {
//     user: User;
//     onAdd: () => void;
//     onAccept: () => void;
//     onRemove: () => void;
// }

// export default function FriendButton({ user }: Props) {