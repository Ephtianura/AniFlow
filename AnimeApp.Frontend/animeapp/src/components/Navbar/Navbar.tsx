import Link from "next/link";
import SearchBar from "./SearchBar";
import RandomAnimeButton from "./RandomAnimeButton";
import AdminButton from "./AdminButton";
import LoginButtons from "./LoginButtons";
import UserAvatar from "./UserAvatar";


export default function Navbar() {

  return (
    <nav className="bg-bg-dark shadow-md sticky top-0 z-50 border-b-3 border-primary text-white mb-6">

      {/* Десктопна версія */}
      <div className="hidden lg:flex justify-between items-center mx-auto w-full max-w-7xl px-4  h-12">

        <div className="flex items-center gap-10">

          {/* Колонка 1 - Ім'я сайту */}
          <Link href="/" className="font-bold text-xl transition-colors flex items-center gap-2">
            <img
              src="/favicon.ico"
              alt="AnimeApp Logo"
              className="w-9 h-9"
            />
            AniFlow
          </Link>

          {/* Колонка 2 - Панель навігації */}
          <div className="flex justify-left gap-4 font-light">

            {/* Аніме */}
            <Link href="/animes" className="nav-button"> Аніме </Link>

            {/* Персонажі */}
            {/* <Link href="/characters" className="nav-button"> Персонажі </Link> */}

            {/* Випадкове аніме */}
            <RandomAnimeButton />

            {/* Адмін-панель */}
            <AdminButton />

          </div>
        </div>

        {/* Колонка 3 - Профіль пошук вийти */}
        <div className="flex items-center text-md py-1 font-light ">

          {/* Ім'я */}
          <UserAvatar />

          {/* Пошук */}
          <SearchBar />

          {/* Вийти / Увійти */}
          <LoginButtons />

        </div>

      </div>

      {/* Мобільна версія */}

      <div className="lg:hidden flex relative items-center justify-between w-full px-4 py-2 h-15">

        <div className="flex-">
          <UserAvatar />
        </div>


        <Link href="/" className="absolute left-1/2 transform -translate-x-1/2 font-bold text-xl transition-colors flex items-center gap-2">
          <img
            src="/favicon.ico"
            alt="AnimeApp Logo"
            className="w-9 h-9"
          />
          AniFlow
        </Link>

        <SearchBar />

      </div>

    </nav >
  );
}
