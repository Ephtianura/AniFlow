import Link from "next/link";
import SearchBar from "./SearchBar";
import AdminButton from "./AdminButton";
import LoginButtons from "./LoginButtons";
import UserAvatar from "./UserAvatar";
import { getMe } from "../../hooks/getMe";
import BurgerMenuButton from "./BurgerMenuButton";


export default async function Navbar() {
  const me = await getMe();

  return (
    <nav className="bg-bg-dark shadow-md fixed top-0 left-0 right-0 z-40 border-b-3 border-primary text-white select-none">

      {/* Десктопна версія */}
      <div className="hidden md:flex justify-between items-center mx-auto w-full max-w-7xl xl:max-w-[1600px] py-2 px-4 h-15 text-md">

        <div className="flex items-center gap-10">

          {/* Колонка 1 - Ім'я сайту */}
          <Link href="/" className="font-bold text-xl transition-colors flex items-center gap-2 py-2">
            <img
              src="/favicon.ico"
              alt="AnimeApp Logo"
              className="w-9 h-9"
            />
            AniFlow
          </Link>

          {/* Колонка 2 - Панель навігації */}
          <div className="flex justify-left font-light items-center">

            {/* Аніме */}
            <Link href="/animes" className="nav-button">
              Аніме
            </Link>

            {/* Персонажі */}
            {/* <Link href="/characters" className="nav-button"> Персонажі </Link> */}

            {/* Випадкове аніме */}
            <Link href={"/anime/random"} className="nav-button">
              Випадкове аніме
            </Link>

            {/* Адмін-панель */}
            <AdminButton me={me} />

          </div>
        </div>

        {/* Колонка 3 - Профіль пошук вийти */}
        <div className="flex items-center text-md py-1 font-light ">

          {/* Ім'я */}
          <UserAvatar me={me} />

          {/* Пошук */}
          <SearchBar />

          {/* Вийти / Увійти */}
          <LoginButtons me={me} />
        </div>

      </div>

      {/* Мобільна версія */}
      <div className="md:hidden flex relative items-center justify-between w-full px-3 py-2 h-15">

        <div className="flex-">
          <UserAvatar me={me} />
        </div>


        <Link href="/" className="absolute left-1/2 transform -translate-x-1/2 font-bold text-xl transition-colors flex items-center gap-2">
          <img
            src="/favicon.ico"
            alt="AnimeApp Logo"
            className="w-9 h-9"
          />
          AniFlow
        </Link>

        <div className="flex gap-3 items-center">
          <SearchBar />
          <BurgerMenuButton me={me} />
        </div>

      </div>

    </nav >
  );
}
