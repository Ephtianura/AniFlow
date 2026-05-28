import Link from "next/link";
import { MdHome } from "react-icons/md";
import { MdSpeakerNotes } from "react-icons/md";
import { FaGears } from "react-icons/fa6";

export default function ProfileSidebar() {
  
  return (
    <div className="hidden lg:block bg-white shadow-[0_0_10px_rgba(0,0,0,0.05)] border border-[#DFDFDF] w-full">
      <div className="flex flex-col text-primary-black">

        {/* Меню */}
        <div className="px-4 py-3 font-medium border-b border-[#DFDFDF] bg-btn-sidebar-hover">
          <p>Меню</p>
        </div>

        <Link href="/profile/">
          <div className="px-5 py-3 flex items-center gap-2 hover:bg-btn-sidebar-hover border-b border-[#DFDFDF] transition">
            <MdHome className="w-5 h-5" />
            <p>Головна</p>
          </div>
        </Link>


        <Link href="/profile/mylist/Watching">
          <div className="px-5 py-3 flex items-center gap-2 hover:bg-btn-sidebar-hover border-b border-[#DFDFDF] transition">
            <MdSpeakerNotes className="w-5 h-5" />
            <p>Список аніме</p>
          </div>
        </Link>

        <Link href="/profile/edit">
          <div className="px-5 py-3 flex items-center gap-2 hover:bg-btn-sidebar-hover border-b border-[#DFDFDF] transition">
            <FaGears className="w-5 h-5" />
            <p>Налаштування</p>
          </div>
        </Link>

      </div>
    </div>
  );
};
