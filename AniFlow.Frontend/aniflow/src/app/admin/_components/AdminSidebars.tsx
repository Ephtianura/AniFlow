import MobileAdminSidebar from "./MobileAdminSidebar";
import AdminSidebar from "./AdminSidebar";

export default function AdminSidebars() {
  return (
    <>
      {/* Desktop */}
      <div className="hidden xl:block w-85">
        <AdminSidebar />
      </div>

      {/* Mobile */}
      <div className="xl:hidden max-w-full">
        <MobileAdminSidebar />
      </div>
    </>
  );
}
