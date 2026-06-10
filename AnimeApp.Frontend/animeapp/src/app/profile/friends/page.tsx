import ProfileImages from "../_components/ProfileImages";
import { formatRegisterDate } from "../_functions/formatRegisterDate";
import { getProfile } from "../_functions/getProfile";
import { getFriends } from "../_functions/getFriends";
import FriendsGrid from "./FriendsGrid";


export const metadata = {
    title: "Мої друзі | AniFlow",
};

export default async function FriendsPage() {
    const profilePromise = getProfile();
    const friendsPromise = getFriends();

    const [profile, friends] = await Promise.all([
        profilePromise,
        friendsPromise,
    ]);
    const formattedRegistrationDate = formatRegisterDate(profile.dateOfRegistration);
    return (
        <div className="flex flex-col gap-2">
            <ProfileImages
                userId={profile.id}
                avatarUrl={profile.avatarUrl}
                bannerUrl={profile.bannerUrl}
                nickname={profile.nickname}
                formattedRegistrationDate={formattedRegistrationDate}
                isOnline={true}
                lastOnline={null}
                showShareButton={true}
            />
            <h1 className="text-[1.875rem] font-medium mb-4">Друзі</h1>

            <FriendsGrid friends={friends} />
        </div>
    );
}
