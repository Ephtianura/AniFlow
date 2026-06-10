import FriendsPreview from "@/app/profile/_components/FriendsPreview";
import { getFriendsById } from "@/app/profile/_functions/getFriends";
import { FriendResponse } from "@/core/types";
import Link from "next/link";
import { FaUser, FaUserFriends } from "react-icons/fa";

type Props = {
  friends: FriendResponse[];
  userId: string;
};


export default async function UserSidebar({ friends, userId }: Props) {

  return (
    <div className="hidden lg:flex flex-col gap-4">

      <div className="bg-white shadow-[0_0_10px_rgba(0,0,0,0.05)] border border-[#DFDFDF] w-full">

        <div className="flex flex-col text-primary-black">

          {/* Меню */}
          <div className="px-4 py-3 font-medium border-b border-[#DFDFDF] bg-btn-sidebar-hover">
            <p>Меню</p>
          </div>

          <Link href={`/user/${userId}/Watching`}>
            <div className="px-5 py-3 flex items-center gap-2 hover:bg-btn-sidebar-hover border-b border-[#DFDFDF] transition">
              <FaUser className="w-5 h-5" />
              <p>Сторінка користувача</p>
            </div>
          </Link>

          <Link href={`/user/${userId}/friends`}>
            <div className="px-5 py-3 flex items-center gap-2 hover:bg-btn-sidebar-hover border-b border-[#DFDFDF] transition">
              <FaUserFriends className="w-5 h-5" />
              <p>Друзі</p>
            </div>
          </Link>

        </div>
      </div>

      <FriendsPreview friends={friends} />
    </div >

  );
};
