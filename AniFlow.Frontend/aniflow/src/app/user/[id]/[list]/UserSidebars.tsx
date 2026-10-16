import UserSidebar from "./UserSidebar";
import MobileProfileSidebar from "./MobileUserSidebar";
import { FriendResponse } from "@/core/types";

type Props = {
  friends: FriendResponse[];
  userId: string;
};

export default function ProfileSidebars({ friends, userId }: Props) {
  return (
    <>
      {/* Desktop */}
      <div className="hidden lg:block w-85 select-none">
        <UserSidebar friends={friends} userId={userId} />
      </div>

      {/* Mobile */}
      <div className="lg:hidden max-w-full select-none">
        <MobileProfileSidebar userId={userId} />
      </div>
    </>
  );
};
