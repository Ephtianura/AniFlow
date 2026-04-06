"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

import { TbLogout, TbLogin } from "react-icons/tb";
import SearchBar from "./SearchBar";


export default function Navbar() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { isLoggedIn, setIsLoggedIn, userRole, userName, setUserRole, logout } = useAuth();

  const handleRandomClick = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await apiFetch("/Animes/random");
      router.push(`/anime/${data.url}`);
    } catch (err) {
      console.error("Помилка при отриманні випадкового аніме:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <nav className="bg-bg-dark shadow-md sticky top-0 z-50 border-b-3 border-primary text-white mb-6">
      <div className="flex justify-between max-w-7xl mx-auto px-4 items-center min-w-[1340px] max-w-[1340px]">

        <div className="flex items-center gap-10">

          {/* Колонка 1 - Ім'я сайту */}
          <div>
            <Link href="/animes" className="font-bold text-xl transition-colors flex items-center gap-2">
              <img
                src="/favicon.ico"
                alt="AnimeApp Logo"
                className="w-9 h-9"
              />
              AniFlow
            </Link>
          </div>

          {/* Колонка 2 - Панель навігації */}
          <div className="flex justify-left gap-4 font-light">

            {/* Аніме */}
            <div>
              <Link href="/animes" className="flex items-center hover:text-btn-hover-dark transition-colors duration-200 ">
                Аніме
              </Link>
            </div>
            {/* Персонажі */}
            {/* <div>
              <Link href="/characters" className="flex items-center hover:text-btn-hover-dark transition-colors duration-200">
                Персонажі
              </Link>
            </div> */}
            {/* Випадкове аніме */}
            <div>
              <a
                href="#"
                onClick={handleRandomClick}
                className="flex items-center hover:text-btn-hover-dark transition-colors duration-200"
              >
                {loading ? "Завантаження..." : "Випадкове аніме"}
              </a>
            </div>

            {/* Адмін-панель */}
            {userRole === "Admin" && (
              <div>
                <Link
                  href="/admin/dashboard"
                  className="flex items-center hover:text-btn-hover-dark transition-colors duration-200"
                >
                  Адмін-панель
                </Link>
              </div>
            )}


          </div>
        </div>

        {/* Колонка 3 - Профіль пошук вийти */}
        <div className="flex justify-items-center text-md py-1 font-light">

          {/* Ім'я */}
          {isLoggedIn && userName && (
            <Link
              href="/profile"
              className="flex items-center gap-1 hover:text-btn-hover-dark px-4 transition-colors duration-200"
            >
              {userName}
            </Link>
          )}

          {/* Пошук */}
          <SearchBar />


          {/* Вийти / Увійти */}
          {isLoggedIn ? (
            // ===== Вийти =====
            <button
              onClick={logout}
              className="flex items-center gap-1 bg-btn-primary-hover rounded-[10px] 
              px-3 py-2 hover:text-btn-hover-dark transition-colors duration-200 cursor-pointer"
            >
              <TbLogout className="w-5 h-5" />
              <p>Вийти</p>
            </button>
          ) : (
            // ===== Увійти =====
            <Link
              href="/login"
              className="flex items-center gap-1 bg-btn-primary-hover rounded-[10px] px-3 py-2 
              hover:text-btn-hover-dark transition-colors duration-200"
            >
              <TbLogin className="w-5 h-5" />
              <p>Увійти</p>
            </Link>
          )}

        </div>


      </div>
    </nav>
  );
}
