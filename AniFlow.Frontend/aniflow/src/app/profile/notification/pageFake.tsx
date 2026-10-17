
// import NotificationsDropdown from "@/components/Navbar/NotificationsDropdown";
// import Link from "next/link";
// import ProfileImages from "../_components/ProfileImages";
// import { formatRegisterDate } from "../_functions/formatRegisterDate";
// import { getProfile } from "../_functions/getProfile";

// export const metadata = {
//     title: "Сповіщення | AniFlow",
// };

// export default async function ProfileHome() {
//     const profile = await getProfile();
//     const formattedRegistrationDate = formatRegisterDate(profile.dateOfRegistration);

//     return (
//         <div className="flex flex-col gap-2 relative">

//             <ProfileImages
//                 userId={profile.id}
//                 avatarUrl={profile.avatarUrl}
//                 bannerUrl={profile.bannerUrl}
//                 nickname={profile.nickname}
//                 formattedRegistrationDate={formattedRegistrationDate}
//                 isOnline={true}
//                 lastOnline={null}
//                 showShareButton={true}
//             />
//             {/* Статистика */}
           
//         </div>
//     );
// }
