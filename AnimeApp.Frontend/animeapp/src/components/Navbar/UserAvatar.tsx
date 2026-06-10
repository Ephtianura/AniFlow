import { UserMeResponse } from "@/core/types";
import Link from "next/link";

type Props = {
    me: UserMeResponse | null
}
export default function UserAvatar({ me }: Props) {
    return (
        <div>
            {me && (
                <Link
                    href="/profile"
                    className="nav-button flex items-center gap-2"
                >
                    {me.avatarUrl != null &&
                        <div className="w-8.5 aspect-square rounded-full flex items-center justify-center overflow-hidden shrink-0">
                            <img
                                src={me.avatarUrl || "/NotFoundPurpleSquare.webp"}
                                className="w-full h-full object-cover shrink-0 aspect-square"
                                alt="Avatar"
                            />
                        </div>
                    }

                    <span className="hidden sm:block">{me.nickname}</span>
                </Link>
            )}
        </div>
    )
}
