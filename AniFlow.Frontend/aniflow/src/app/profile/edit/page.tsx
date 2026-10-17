import ProfileImages from "../_components/ProfileImages";
import { formatRegisterDate } from "../_functions/formatRegisterDate";
import { getProfile } from "../_functions/getProfile";
import EditForm from "../_components/EditProfileForm";

export const metadata = {
    title: "Мої налаштування | AniFlow",
    description:
        "Керуйте своїм акаунтом: змінюйте аватар, банер, нікнейм, email та пароль у налаштуваннях AniFlow.",
};

export default async function ProfileEdit() {
    const profile = await getProfile();
    const formattedRegistrationDate = formatRegisterDate(profile.dateOfRegistration);

    return (
        <div className="flex flex-col gap-2">
            <ProfileImages
                userId={profile.id}
                avatarUrl={profile.avatarUrl}
                bannerUrl={profile.bannerUrl}
                nickname={profile.nickname}
                formattedRegistrationDate={formattedRegistrationDate}
                onEdit={true}
                isOnline={true}
                lastOnline={null}
                showShareButton={false}
            />
            <h1 className="text-[1.875rem] font-medium mb-4">Налаштування</h1>

            <EditForm profile={profile} />
        </div>
    );
}
