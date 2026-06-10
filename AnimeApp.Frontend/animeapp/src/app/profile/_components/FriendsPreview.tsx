import { FriendResponse } from "@/core/types";
import Link from "next/link";
import OnlineIndicator from "./OnlineIndicator";

type Props = {
    friends: FriendResponse[];
};

export default function FriendsPreview({ friends }: Props) {
    return (
        <div className="flex flex-col gap-2">
            <div className="flex gap-2">
                <h5 className="font-medium text-[1.25rem]">Друзі</h5>

                {friends.length > 0 && (
                    <span className="text-xs font-medium">{friends.length}</span>
                )}
            </div>

            {friends.length > 0 ? (
                <div className="grid grid-cols-3 gap-2">
                    {friends.slice(0, 6).map((friend) => (
                        <Link
                            key={friend.userId}
                            href={`/user/${friend.userId}/Watching`}
                            className="flex flex-col gap-1 items-center hover:scale-102 active:scale-98 transition duration-200"
                        >
                            <div className="relative">
                                <img
                                    src={friend.avatarUrl || `/NotFoundPurpleSquare.webp`}
                                    alt="avatar"
                                    className="shrink-0 object-cover aspect-square rounded-full pointer-events-none"
                                />
                                {/* <img
                                    src={friend.avatarUrl || `/NotFoundPurpleSquare.webp`}
                                    alt="avatar"
                                    className={`shrink-0 object-cover aspect-square rounded-full transition
                    ${friend.isOnline ? "" : "grayscale opacity-60"}`}
                                /> */}
                                <OnlineIndicator isOnline={friend.isOnline} />

                            </div>

                            <span>{friend.nickname}</span>

                            {/* <span className={`${friend.isOnline ? "" : "text-gray-400"}`}>
                                {friend.nickname}
                            </span> */}
                        </Link>
                    ))}
                </div>
            ) : (
                <span className="text-sm text-[#18191a80]">Немає друзів</span>
            )}
        </div>
    );
}