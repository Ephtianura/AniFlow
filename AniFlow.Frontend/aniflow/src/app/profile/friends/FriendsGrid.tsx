import { FriendResponse } from "@/core/types";
import Link from "next/link";
import OnlineIndicator from "../_components/OnlineIndicator";
import { formatRegisterDate } from "../_functions/formatRegisterDate";

type Props = {
    friends?: FriendResponse[]
}
export default async function FriendsGrid({ friends }: Props) {
    if (!friends || friends.length == 0) return <div className="text-gray-500">Немає друзів</div>
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {friends.map((friend) => (
                <Link
                    key={friend.userId}
                    href={`/user/${friend.userId}`}
                    className="rounded-full h-25 w-full flex  items-center hover:scale-102 active:scale-99 transition duration-200 cursor-pointer relative">
                    <div className="flex gap-3 ">
                        <div className="ring-3 w-25 h-full rounded-full  shrink-0 ring-white shadow-2xl relative">
                            <img
                                src={friend.avatarUrl || "/NotFoundPurpleSquare.webp"}
                                alt="avatar"
                                className="object-cover shrink-0 w-full h-full rounded-full aspect-square pointer-events-none"
                            />
                            <OnlineIndicator isOnline={friend.isOnline} className="right-0!" />
                        </div>

                        <div className="flex flex-col gap-2">
                            <p className="primary-link">
                                {friend.nickname}
                            </p>
                            {friend.acceptedAt && (
                                <p className="text-sm text-gray-500">
                                    Друзі з {formatRegisterDate(friend.acceptedAt)}
                                </p>
                            )}

                        </div>
                    </div>
                    <img
                        src={friend.bannerUrl || "/NotFoundBannerPurple.webp"}
                        alt="banner"
                        className="hidden xs:flex absolute right-0 top-0 object-cover shrink-0 w-[50%] sm:w-[70%] h-full rounded-r-full pointer-events-none"
                        style={{
                            maskImage: "linear-gradient(to right, transparent 5%, black 60%, black 100%)",
                            WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 60%, black 100%)",
                        }}
                    />
                </Link>
            ))}
        </div>
    );
}
