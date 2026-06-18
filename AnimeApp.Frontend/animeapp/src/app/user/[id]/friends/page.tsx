
// export async function generateMetadata({ params, }: Props) {
//     const { id } = await params;
//     const profilePromise = getProfileById(id);

import { getFriendsById } from "@/app/profile/_functions/getFriends";
import { getUserPage } from "../[list]/getUserPage";
import { formatRegisterDate } from "@/app/profile/_functions/formatRegisterDate";
import ProfileImages from "@/app/profile/_components/ProfileImages";
import FriendsGrid from "@/app/profile/friends/FriendsGrid";
import WhiteCard from "@/components/WhiteCard";
import { UserStatsRow } from "@/app/profile/_components/UserStatsRow";
import { formatWatchTime } from "@/app/profile/_functions/formatWatchTime";

interface Props {
    params: Promise<{
        id: string;
    }>;
}

export async function generateMetadata({ params }: Props) {
    const { id } = await params;
    const user = await getUserPage(id)
    return {
        title: `Друзі ${user.nickname} | AniFlow`
    };
}

export default async function UserFriends({ params }: Props) {
    const { id } = await params;

    const userPromise = getUserPage(id)
    const friendsPromise = getFriendsById(id);

    const [profile, friends] = await Promise.all([
        userPromise,
        friendsPromise,
    ]);
    const formattedRegistrationDate = formatRegisterDate(profile.dateOfRegistration);
    const watchTime = formatWatchTime(profile.timeSpent);

    return (
        <div className="flex flex-col gap-4">

            <WhiteCard>
                <div className="flex flex-col gap-2">

                    <ProfileImages
                        userId={profile.id}
                        avatarUrl={profile.avatarUrl}
                        bannerUrl={profile.bannerUrl}
                        nickname={profile.nickname}
                        formattedRegistrationDate={formattedRegistrationDate}
                        isOnline={profile.isOnline}
                        lastOnline={profile.lastOnline}
                        user={profile}
                        showShareButton={true}
                    />
                    <h1 className="text-xl font-medium -mb-2">Аніме</h1>
                    <UserStatsRow
                        watchTime={watchTime}
                        averageScore={profile.averageScore}
                    />
                </div >
            </WhiteCard>

            <WhiteCard>
                <h1 className="text-[1.875rem] font-medium mb-4">Друзі</h1>

                <FriendsGrid friends={friends} />
            </WhiteCard>

        </div >

    );
}
