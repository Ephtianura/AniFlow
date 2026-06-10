import ProfileSidebar from "./ProfileSidebar";
import MobileProfileSidebar from "./MobileProfileSidebar";

export default function ProfileSidebars() {
  return (
    <>
      {/* Desktop */}
      <div className="hidden lg:block w-85 select-none">
        <ProfileSidebar />
      </div>

      {/* Mobile */}
      <div className="lg:hidden max-w-full select-none">
        <MobileProfileSidebar />
      </div>
    </>
  );
};
