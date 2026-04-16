"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { IoIosAirplane } from "react-icons/io";
import { RiMovie2AiLine } from "react-icons/ri";
import { FaMasksTheater } from "react-icons/fa6";
import { FaTheaterMasks } from "react-icons/fa";
import { LuBuilding2 } from "react-icons/lu";
import { FaUsers } from "react-icons/fa";
import { TbHomeStats } from "react-icons/tb";
import { usePathname } from "next/navigation";


export default function AdminSidebar() {
  const { userRole } = useAuth();
  const pathname = usePathname();

  const linkClasses = (paths: string | string[]) => {
    const arr = Array.isArray(paths) ? paths : [paths];
    const isActive = arr.some(path => pathname.startsWith(path));
    return `px-5 py-3 flex items-center gap-2 border-b-1 border-[#DFDFDF] transition-colors
    ${isActive ? "bg-btn-sidebar-hover font-medium" : "hover:bg-btn-sidebar-hover"}`;
  };
  // неактивна


  return (
    <div className="hidden lg:block bg-white shadow-[0_0_10px_rgba(0,0,0,0.05)] border-1 border-[#DFDFDF] w-85">
      <div className="flex flex-col text-primary-black">

        {/* Меню */}
        <div className="px-4 py-3 font-medium border-b-1 border-[#DFDFDF] bg-btn-sidebar-hover">
          <p>Меню</p>
        </div>

        <Link href="/admin/dashboard">
          <div className={linkClasses("/admin/dashboard")}>
            <TbHomeStats className="w-5 h-5" />
            <p>Головна</p>
          </div>
        </Link>

        <Link href="/admin/animes/create">
          <div className={linkClasses([
            "/admin/animes/create",
            "/admin/animes/update",
            "/admin/animes/delete"
          ])}>
            <RiMovie2AiLine className="w-5 h-5" />
            <p>Управління аніме</p>
          </div>
        </Link>

        <Link href="/admin/studios/create">
          <div className={linkClasses([
            "/admin/studios/create",
            "/admin/studios/update",
            "/admin/studios/delete"
          ])}>
            <LuBuilding2 className="w-5 h-5" />
            <p>Управління студіями</p>
          </div>
        </Link>


        <Link href="/admin/genres">
          <div className={linkClasses("/admin/genres")}>
            <FaMasksTheater className="w-5 h-5" />
            <p>Управління жанрами</p>
          </div>
        </Link>


        {/* <Link href="/admin/users">
          <div className="px-5 py-3 flex items-center gap-2 hover:bg-btn-sidebar-hover border-b-1 border-[#DFDFDF]">
            <FaUsers className="w-5 h-5" />
            <p>Користувачі</p>
          </div>
        </Link> */}

      </div>
    </div>
  );
}
